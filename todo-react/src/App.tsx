import React, { useState, useEffect } from "react";
import axios from "axios";

type Todo = {
  id: number;
  title: string;
  status: boolean;
};

const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]); // Todoリストの状態
  const [inputTitle, setInputTitle] = useState(""); // 新しいタスクの入力

  // 初期ロード時にTodoリストを取得
  useEffect(() => {
    axios
      .get("https://go-todo-app-a79d54865eb7.herokuapp.com/todos")
      .then((response) => {
        setTodos(response.data);
      })
      .catch((error) => {
        console.error("Error fetching todos:", error);
      });
  }, []);

  // Todoを追加
  const addTodo = () => {
    if (!inputTitle) return; // タイトルが空なら何もしない

    axios
      .post("https://go-todo-app-a79d54865eb7.herokuapp.com/todos", {
        title: inputTitle,
        status: false,
      })
      .then((response) => {
        setTodos([...todos, response.data]); // 新しいタスクをリストに追加
        setInputTitle(""); // 入力欄をクリア
      })
      .catch((error) => {
        console.error("Error adding todo:", error);
      });
  };

  // Todoを削除
  const deleteTodo = (id: number) => {
    axios
      .delete(`https://go-todo-app-a79d54865eb7.herokuapp.com/todos/${id}`)
      .then(() => {
        setTodos(todos.filter((todo) => todo.id !== id)); // 指定したタスクを削除
      })
      .catch((error) => {
        console.error("Error deleting todo:", error);
      });
  };

  // Todoの状態を切り替え
  const toggleTodoStatus = (id: number) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    axios
      .put(`https://go-todo-app-a79d54865eb7.herokuapp.com/todos/${id}`, {
        ...todo,
        status: !todo.status,
      })
      .then((response) => {
        setTodos(todos.map((t) => (t.id === id ? response.data : t))); // 更新したタスクをリストに反映
      })
      .catch((error) => {
        console.error("Error updating todo:", error);
      });
  };

  return (
    <div>
      <h1>Todo List</h1>
      <div>
        <input
          type="text"
          placeholder="新しいタスクを入力"
          value={inputTitle}
          onChange={(e) => setInputTitle(e.target.value)}
        />
        <button onClick={addTodo}>追加</button>
      </div>
      <ul>
        {Array.isArray(todos) &&
          todos.map((todo) => (
            <li key={todo.id}>
              <span
                style={{
                  textDecoration: todo.status ? "line-through" : "none",
                  cursor: "pointer",
                }}
                onClick={() => toggleTodoStatus(todo.id)}
              >
                {todo.title}
              </span>
              <button onClick={() => deleteTodo(todo.id)}>削除</button>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default App;
