export const createCodeSnippetTableQuery = `
  CREATE TABLE IF NOT EXISTS code_snippets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    code_language ENUM('C++', 'Java', 'JavaScript', 'Python') NOT NULL,
    stdin TEXT,
    source_code TEXT NOT NULL,
    code_output TEXT,
    submittedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`;

export const getCodeSnippetsQuery = `
SELECT * FROM code_snippets
`;

export const insertCodeSnippetQuery = `
  INSERT INTO code_snippets (username, code_language, stdin, source_code)
  VALUES (?, ?, ?, ?)
`;

export const updateCodeOutputQuery = `
  UPDATE code_snippets
  SET code_output = ?
  WHERE id = ?
`;
