import React, { useState } from 'react';
import { Card } from '../App';

interface Todo { id: number; text: string; completed: boolean; }

const DashboardView: React.FC = () => {
    const [todos, setTodos] = useState<Todo[]>([
        { id: 1, text: 'Review Q2 analytics report', completed: true },
        { id: 2, text: 'Generate draft for new blog post', completed: false },
        { id: 3, text: 'Finalize 3D model for "Aether-Loom"', completed: false },
    ]);
    const [inputText, setInputText] = useState('');

    const handleAddTodo = (e: React.FormEvent) => {
        e.preventDefault();
        if (inputText.trim()) {
            setTodos([...todos, { id: Date.now(), text: inputText, completed: false }]);
            setInputText('');
        }
    };
    const toggleTodo = (id: number) => setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    const deleteTodo = (id: number) => setTodos(todos.filter(t => t.id !== id));

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card>
                <h3 className="text-2xl font-bold mb-4">Task Manager</h3>
                <form onSubmit={handleAddTodo} className="flex gap-2 mb-4">
                    <input type="text" value={inputText} onChange={e => setInputText(e.target.value)} placeholder="Add a new task..." className="flex-grow bg-gray-200 dark:bg-gray-800 border border-brand-border-light dark:border-brand-border rounded-md px-4 py-2 focus:ring-2 focus:ring-brand-blue focus:outline-none" />
                    <button type="submit" className="bg-brand-blue text-white font-bold px-6 py-2 rounded-md hover:bg-opacity-80 transition-colors">Add</button>
                </form>
                <ul className="space-y-3 h-48 overflow-y-auto">
                    {todos.map(todo => (
                        <li key={todo.id} className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 p-3 rounded-md">
                            <span onClick={() => toggleTodo(todo.id)} className={`cursor-pointer ${todo.completed ? 'line-through text-gray-500' : ''}`}>{todo.text}</span>
                            <button onClick={() => deleteTodo(todo.id)} className="text-red-500 hover:text-red-400 font-bold">✕</button>
                        </li>
                    ))}
                </ul>
            </Card>
            <Card>
                <h3 className="text-2xl font-bold mb-4">Team Chat</h3>
                <div className="space-y-4 h-64 overflow-y-auto bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                    <div className="flex gap-2 items-start"><span className="font-bold text-green-600 dark:text-green-400">Alice:</span><p>Just pushed the latest updates to the analytics branch.</p></div>
                    <div className="flex gap-2 items-start"><span className="font-bold text-purple-600 dark:text-purple-400">Bob:</span><p>Great! I'll review them now. How's the Gemini integration for insights coming along?</p></div>
                    <div className="flex gap-2 items-start"><span className="font-bold text-green-600 dark:text-green-400">Alice:</span><p>It's working surprisingly well. The generated analysis is spot on. Check it out on the Analytics page.</p></div>
                    <div className="flex gap-2 items-start"><span className="font-bold text-yellow-600 dark:text-yellow-400">Charlie:</span><p>Can someone help me with the 3D configurator? The lighting looks a bit off.</p></div>
                </div>
            </Card>
        </div>
    );
};

export default DashboardView;
