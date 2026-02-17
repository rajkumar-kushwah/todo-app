import api  from "./api.service";

export const CreateTodo = async (data:{
    title: string,
    description: string,
}) => {
    const response = await api.post('/todos', data);
    return response.data
}


export const GetTodos = async () => {
    const response = await api.get('/todos');
    return response.data
}

export const DeleteTodo = async (id: number) => {
    const response = await api.delete(`/todos/${id}`);
    return response.data
}

export const UpdateTodo = async (id: number, data: {
   title?: string;
    description?: string;
    completed?: boolean;
}) =>{
    const response = await api.put(`/todos/${id}`, data);
    return response.data
}