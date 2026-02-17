import React from 'react'
import { CreateTodo, GetTodos, DeleteTodo, UpdateTodo } from '../services/todo.service';

interface TodoItem {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

function Todo() {
  const [todos, setTodos] = React.useState<TodoItem[]>([]);
  const [title, setTitle] = React.useState('');
  const [description, setDescription] = React.useState('');
  const [edit, setEdit] = React.useState<number | null>(null);
  // const [isModeOpen, setIsModeOpen] = React.useState(false);
  const [completed, setCompleted] = React.useState(false);

  const fetchTodos = async () => {
    const todos = await GetTodos();
    setTodos(todos);
  }

  React.useEffect(() => {
    fetchTodos();
  }, [])

  const handeleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // edite 

      if (edit) {
        await UpdateTodo(edit, {
          title,
          description,
          completed

        })
        setEdit(null);
      } else {
        const newTodo = await CreateTodo({
          title,
          description,
        })
        console.log("Created todo", newTodo)
      }
      setEdit(null);
      setTitle('');
      setDescription('');
      // setIsModeOpen(false);
      fetchTodos();

    } catch (error) {
      console.error(error)
    }


  }

  const handeledelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this todo?'))
      try {
        await DeleteTodo(id);

        fetchTodos();

      } catch (error) {
        console.error(error)

      }
  }

  const handeleUpdate = async (todo: TodoItem) => {
    setEdit(todo.id);
    setTitle(todo.title);
    setDescription(todo.description);
    // checkbox checked
    setCompleted(todo.completed);
    // setIsModeOpen(true);
  }

  return (
    <div>
      {/* Form */}

      <div className='mode'>
        <h2>Update Todo</h2>
        <form onSubmit={handeleSubmit} >
          <label htmlFor="title">Title</label>
          <input id='title' value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder='Enter a title' />
          <label htmlFor="description">Description</label>
          <input type="text" id='description' value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Enter a description' />
          <button type='submit'>submit</button>
        </form>
      </div>


      {/* Todo list */}
      
      <table>
        <tbody>
          {todos.map((Todo) => (
            <tr key={Todo.id}>

              <td>
                <input
                  type="checkbox"
                  checked={Todo.completed}
                  onChange={async (e) => {
                    await UpdateTodo(Todo.id, {
                      completed: e.target.checked,
                    });
                    fetchTodos();
                  }}
                />
              </td>

              <td>{Todo.title}</td>
              <td>{Todo.description}</td>
              <td><button
                // disabled={Todo.completed}
                onClick={() => handeleUpdate(Todo)}>Update</button>

              </td>

              <td><button onClick={() => handeledelete(Todo.id)}>Delete</button></td>

            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}



export default Todo
