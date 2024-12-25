package main

import (
	"net/http"
	"strconv"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

// Todo構造体
type Todo struct {
    ID     int    `json:"id"`     // ID
    Title  string `json:"title"`  // タイトル
    Status bool   `json:"status"` // 完了状態
}

// メモリ上にTodoリストを保存
var todos []Todo

func main() {
    r := gin.Default()

    // CORSの設定を有効化
    r.Use(cors.Default())

    // エンドポイント
    r.GET("/todos", getTodos)     // Todo一覧取得
    r.POST("/todos", createTodo) // Todo追加
    r.PUT("/todos/:id", updateTodo) // Todo更新
    r.DELETE("/todos/:id", deleteTodo) // Todo削除

    // サーバー起動
    r.Run(":8080")
}

// Todo一覧取得 (GET /todos)
func getTodos(c *gin.Context) {
    c.JSON(http.StatusOK, todos)
}

// Todo追加 (POST /todos)
func createTodo(c *gin.Context) {
    var newTodo Todo
    if err := c.ShouldBindJSON(&newTodo); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
        return
    }
    newTodo.ID = len(todos) + 1
    todos = append(todos, newTodo)
    c.JSON(http.StatusCreated, newTodo)
}

// Todo更新 (PUT /todos/:id)
func updateTodo(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
        return
    }

    var updatedTodo Todo
    if err := c.ShouldBindJSON(&updatedTodo); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request"})
        return
    }

    for i, todo := range todos {
        if todo.ID == id {
            todos[i].Title = updatedTodo.Title
            todos[i].Status = updatedTodo.Status
            c.JSON(http.StatusOK, todos[i])
            return
        }
    }

    c.JSON(http.StatusNotFound, gin.H{"error": "Todo not found"})
}

// Todo削除 (DELETE /todos/:id)
func deleteTodo(c *gin.Context) {
    id, err := strconv.Atoi(c.Param("id"))
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
        return
    }

    for i, todo := range todos {
        if todo.ID == id {
            todos = append(todos[:i], todos[i+1:]...)
            c.JSON(http.StatusOK, gin.H{"message": "Todo deleted"})
            return
        }
    }

    c.JSON(http.StatusNotFound, gin.H{"error": "Todo not found"})
}
