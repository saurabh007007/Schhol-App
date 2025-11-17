import { ChangeEvent, FormEvent, useState } from "react"
import axios from "axios";

const Login = () => {

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, formData, {
            withCredentials: true
        })
            .then(response => {
                console.log("Login successful:", response.data);
            })
            .catch(error => {
                console.error("Login failed:", error);
            });
    }
    return (
        <div className="flex items-center justify-center h-screen">
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        id="email"
                        type="text"
                        placeholder="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                        Password
                    </label>
                    <input
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                        id="password"
                        type="password"
                        placeholder="******************"
                        name="password"
                        value={formData.password}
                        onChange={(e) => handleChange(e)}
                    />
                </div>
                <div className="flex items-center justify-between">
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        Sign In
                    </button>
                </div>
            </form>
            <h1 className="text-3xl font-bold">Login</h1>
        </div>
    )
}

export default Login