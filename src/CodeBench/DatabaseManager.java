package CodeBench;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;

public class DatabaseManager {
	public static void getData(String submissionID)
			throws ClassNotFoundException, SQLException, IOException {
		Class.forName("org.postgresql.Driver");
		Connection connection = null;
		// System.out.print("Connecting...");
		connection = DriverManager.getConnection(
				"jdbc:postgresql://54.201.74.218:5432/codebench", "postgres",
				"yoloswag");
		connection.setAutoCommit(false);
		String sql = "SELECT * FROM codebench.submission;";
		// System.out.println("Done!");
		Statement statement = connection.createStatement();
		ResultSet result = statement.executeQuery(sql);

		while (result.next()) {
			String submissionCode = result.getString("code");
			// System.out.println(submissionCode);
			if (submissionCode != null) {
				File filePath = new File("programs" + File.separator
						+ generateFileName());
				filePath.mkdirs();

				String fileName = filePath + File.separator + "program.java";
				File codeFile = new File(fileName);
				codeFile.createNewFile();
				PrintWriter writer = new PrintWriter(fileName, "UTF-8");
				writer.println("import java.io.*;");
				writer.println("import java.util.*;");
				writer.println("");
				writer.println("public class program {");
				writer.println(submissionCode.replace("\r", ""));
				writer.println("}");
				writer.close();

				// ////////////////////////////////////////////////////////////////
				// Get the Question Input and Output
				int questionID = result.getInt("question");
				Statement input_statement = connection.createStatement();
				ResultSet input_result = input_statement
						.executeQuery("SELECT * FROM codebench.question where question_id="
								+ questionID + ";");

				String correct_output = "";
				while (input_result.next()) {
					correct_output = input_result.getString("output");
					String inputFileName = filePath + File.separator
							+ "input.txt";
					File f = new File(inputFileName);
					f.createNewFile();
					writer = new PrintWriter(inputFileName, "UTF-8");
					writer.print(input_result.getString("input"));
					writer.close();
					break;
				}

				Manager.runProgram(fileName, submissionID, connection, correct_output);

				codeFile.delete();
				File compiledFile = new File("programs" + File.separator
						+ fileName.replace(".java", ".class"));
				if (compiledFile.exists())
					compiledFile.delete();
				File inputFile = new File(filePath + File.separator
						+ "input.txt");
				if (inputFile.exists())
					inputFile.delete();
				filePath.delete();
			}
		}
		// System.out.println("statement built");
		result.close();
		statement.close();
		connection.close();

		System.out.println(submissionID);
		System.exit(0);
		// CommunicationManager.sendMessage(submissionID);
	}

	private static String generateFileName() {
		String ans = "";
		for (int i = 0; i < 15; i++) {
			ans += (char) ((int) ((Math.random() * 26)) + 97);
		}
		return ans;
	}

	public static void main(String args[]) {
		try {
			getData(args[0]);
		} catch (ClassNotFoundException | SQLException | IOException e) {
			e.printStackTrace();
		}
	}
}