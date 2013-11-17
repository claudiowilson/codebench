package CodeBench;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.sql.Connection;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import net.sf.json.JSONObject;

public class Manager {

	private static final ExecutorService pool = Executors
			.newFixedThreadPool(10);

	public static void runProgram(String codePath, String submissionID,
			Connection connection, String correct_output) {
		Future<Map<String, String>> result = pool.submit(new SubmissionRunner(
				codePath, correct_output));
		try {
			Map<String, String> results = result.get();
			
			if(results.get("error").equals("true")) {
				Statement statement = connection.createStatement();
				statement
						.executeUpdate("UPDATE codebench.submission SET submission_error='"
								+ results.get("message") + "' WHERE submission_id="
								+ submissionID);
				connection.commit();
				statement.close();
				return;
			}
			
			// System.out.println(results);
			Statement statement = connection.createStatement();
			JSONObject json = JSONObject.fromObject(results);
			statement
					.executeUpdate("UPDATE codebench.submission SET result='"
							+ json.toString() + "' WHERE submission_id="
							+ submissionID);
			connection.commit();
			// System.out.println("statement built");
			statement.close();
			// System.out.println("statement closed");
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}

class SubmissionRunner implements Callable<Map<String, String>> {
	String codePath;
	String programName;
	String correct_output;

	public SubmissionRunner(String codePath, String correct_output) {
		if (!codePath.endsWith(".java")) {
			codePath = codePath + ".java";
		}
		this.codePath = codePath;
		programName = codePath.replace(".java", "");
		this.correct_output = correct_output;
		// System.out.println(codePath + " " + programName);
	}

	@Override
	public Map<String, String> call() throws Exception {
		Map<String, String> json = new HashMap<String, String>();

		if (!codePath.endsWith(".java")) {
			codePath = codePath + ".java";
		}

		File codeFile = new File(codePath);
		if (!codeFile.exists()) {
			json.put("error", "true");
			json.put("message", "Code file does not exist");
			return json;
		}
		File compiledFile = new File(programName + ".class");
		if (compiledFile.exists()) {
			compiledFile.delete();
		}

		// System.out.println("compile");

		Process process = new ProcessBuilder("javac", codePath).start();

		String output = getOutput(process);
		String error = getError(process);

		process.waitFor();

		if (process.exitValue() != 0) {
			json.put("error", "true");
			json.put("message", "Compilation error\n" + error);
			return json;
		}

		// System.out.println("run");

		long averageTime = 0;

		for (int i = 0; i < 10; i++) {
			long startTime = System.currentTimeMillis();
			process = new ProcessBuilder("java",
					programName.substring(programName
							.lastIndexOf(File.separator) + 1)).directory(
					new File(programName.substring(0,
							programName.lastIndexOf(File.separator) + 1)))
					.start();

			output = getOutput(process);
			error = getError(process);

			process.waitFor();
			long elapsedTime = System.currentTimeMillis() - startTime;
			averageTime += elapsedTime;

			if (process.exitValue() != 0) {
				json.put("error", "true");
				json.put("message", "Runtime error\n" + error);
				return json;
			}
		}

		output = output.replace("\n", "").trim();
		if (output.equals(correct_output)) {
			json.put("time", "" + 1.0 * averageTime / 1000);
			json.put("error", "false");
			json.put("message", output);
		} else {
			json.put("error", "true");
			json.put("message", "Incorrect output");
		}

		return json;
	}

	private static String getError(Process p) throws IOException {
		BufferedReader br = new BufferedReader(new InputStreamReader(
				p.getErrorStream()));
		StringBuilder builder = new StringBuilder();
		String line = null;
		while ((line = br.readLine()) != null) {
			builder.append(line);
			builder.append(System.getProperty("line.separator"));
		}
		String result = builder.toString();
		return result;
	}

	private static String getOutput(Process p) throws IOException {
		BufferedReader br = new BufferedReader(new InputStreamReader(
				p.getInputStream()));
		StringBuilder builder = new StringBuilder();
		String line = null;
		while ((line = br.readLine()) != null) {
			builder.append(line);
			builder.append(System.getProperty("line.separator"));
		}
		String result = builder.toString();
		return result;
	}
}