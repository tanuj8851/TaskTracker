
import React, { useEffect, useState } from 'react';
import { useAuth } from "../context/AuthContext";
import toast from 'react-hot-toast';

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState('');
    const [projectName, setProjectTitle] = useState('');
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [tasks, setTasks] = useState([]);
    const { getProjects, createProject, createTask, updateTask, deleteTask, getTasks } = useAuth();

    useEffect(() => {
        fetchProjects();
    }, []);

    useEffect(() => {
        if (selectedProject) fetchTasks(selectedProject);
    }, [selectedProject]);

    const fetchProjects = async () => {
        const { data } = await getProjects();
        setProjects(data);
    };

    const fetchTasks = async (projectId) => {
        const { data } = await getTasks(projectId);
        setTasks(data);
    };

    const handleAddProject = async () => {
        if (!projectName.trim()) return;
        await createProject(projectName.trim());
        toast.success('Project created.')
        setProjectTitle('');
        fetchProjects();
    };

    const handleAddTask = async () => {
        if (!taskTitle.trim() || !taskDescription.trim()) return;
        await createTask(selectedProject, taskTitle.trim(), taskDescription.trim());
        toast.success("Task created.")
        setTaskTitle('');
        setTaskDescription('');
        fetchTasks(selectedProject);
    };

    const handleEditTask = async (task) => {
        const newTitle = prompt('Edit task title:', task.title);
        const newDesc = prompt('Edit task description:', task.description);
        const newStatus = prompt('Edit task status (todo, in-progress, completed):', task.status);

        const validStatuses = ["todo", "in-progress", "completed"];
        if (
            newTitle !== null &&
            newDesc !== null &&
            newStatus !== null &&
            validStatuses.includes(newStatus.trim().toLowerCase())
        ) {
            await updateTask(task._id, newTitle.trim(), newDesc.trim(), newStatus.trim().toLowerCase());
            toast.success('Task updated.')
            fetchTasks(selectedProject);
        } else {
            alert("Invalid input. Status must be one of: todo, in-progress, completed.");
        }
    };

    const handleDeleteTask = async (taskId) => {
        await deleteTask(taskId);
        fetchTasks(selectedProject);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    return (
        <div className="bg-blue-50 text-blue-900 min-h-screen">
            <main className="p-6 max-w-5xl mx-auto">
                <section className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                        <input
                            type="text"
                            placeholder="New project title"
                            value={projectName}
                            onChange={(e) => setProjectTitle(e.target.value)}
                            className="border px-2 py-1 rounded"
                        />
                        <button onClick={handleAddProject} className="bg-blue-500 text-white px-3 py-1 rounded">
                            Add Project
                        </button>
                    </div>

                    <div>
                        <label className="mr-2">Select Project:</label>
                        <select
                            value={selectedProject}
                            onChange={(e) => setSelectedProject(e.target.value)}
                            className="border px-2 py-1 rounded"
                        >
                            <option value="">-- Select --</option>
                            {projects?.map((proj) => (
                                <option key={proj._id} value={proj._id}>
                                    {proj.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </section>

                {selectedProject && (
                    <>
                        <section className="mb-4">
                            <h2 className="text-lg font-semibold mb-2">Add Task</h2>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Task title"
                                    value={taskTitle}
                                    onChange={(e) => setTaskTitle(e.target.value)}
                                    className="border px-2 py-1 rounded"
                                />
                                <input
                                    type="text"
                                    placeholder="Task description"
                                    value={taskDescription}
                                    onChange={(e) => setTaskDescription(e.target.value)}
                                    className="border px-2 py-1 rounded"
                                />
                                <button onClick={handleAddTask} className="bg-blue-500 text-white px-3 py-1 rounded">
                                    Add Task
                                </button>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-lg font-semibold mb-2">Tasks</h2>
                            <ul className="space-y-2">
                                {tasks?.map((task) => (
                                    <li key={task._id} className="border p-2 rounded flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold">{task.title}</h3>
                                            <p>{task.description}</p>
                                            <p><strong>Status:</strong> {task.status}</p>
                                            <p><strong>Created:</strong> {formatDate(task.createdAt)}</p>
                                        </div>
                                        <div className="space-x-2">
                                            <button
                                                onClick={() => handleEditTask(task)}
                                                className="text-blue-500 hover:underline"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTask(task._id)}
                                                className="text-red-500 hover:underline"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    </>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
