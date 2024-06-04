import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

interface FormProps {
    onSubmit: (nicknameOrRepo: string, type: string) => void;
}

const FormComponent: React.FC<FormProps> = ({ onSubmit }) => {
    const [nicknameOrRepo, setNicknameOrRepo] = useState('');
    const [type, setType] = useState('user');

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        onSubmit(nicknameOrRepo, type);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={nicknameOrRepo}
                onChange={(e) => setNicknameOrRepo(e.target.value)}
                placeholder="Enter nickname or repo"
            />
            <select value={type} onChange={(e) => setType(e.target.value)}>
                <option value="user">User</option>
                <option value="repo">Repo</option>
            </select>
            <button type="submit">Submit</button>
        </form>
    );
};

interface User {
    name: string;
    public_repos: number;
}

interface Repo {
    full_name: string;
    stargazers_count: number;
}

interface InfoProps {
    data: User | Repo | null;
    type: string;
}

const InfoDisplay: React.FC<InfoProps> = ({ data, type }) => {
    if (!data) {
        return null;
    }

    if (type === 'user') {
        const user = data as User;
        return (
            <div>
                <p>Full Name: {user.name}</p>
                <p>Number of Repositories: {user.public_repos}</p>
            </div>
        );
    } else {
        const repo = data as Repo;
        return (
            <div>
                <p>Repository Name: {repo.full_name}</p>
                <p>Stars: {repo.stargazers_count}</p>
            </div>
        );
    }
};

const App: React.FC = () => {
    const [data, setData] = useState<User | Repo | null>(null);
    const [type, setType] = useState<string>('user');

    const handleSubmit = async (nicknameOrRepo: string, type: string) => {
        setType(type);
        const url = type === 'user'
            ? `https://api.github.com/users/${nicknameOrRepo}`
            : `https://api.github.com/repos/${nicknameOrRepo}`;

        try {
            const response = await axios.get(url);
            setData(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
            setData(null);
        }
    };

    return (
        <div>
            <FormComponent onSubmit={handleSubmit} />
            <InfoDisplay data={data} type={type} />
        </div>
    );
};

export default App;
