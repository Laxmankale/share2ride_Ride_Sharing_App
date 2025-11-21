import { useState } from "react";
import { registerApi } from "../api/auth";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        role: "Passenger", // Default role matching backend enum
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // Validation
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            return;
        }
        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setIsLoading(true);

        try {
            // Prepare data for backend (exclude confirmPassword)
            const { confirmPassword, ...dataToSend } = formData;

            await registerApi(dataToSend);

            // Redirect to login with success message
            navigate("/login", { state: { message: "Registration successful! Please log in." } });
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transform transition-all hover:scale-[1.01]">
                <div className="p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-extrabold text-gray-900 mb-2">Create Account</h1>
                        <p className="text-gray-500">Join Share2Go today</p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm flex items-center animate-pulse">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                                name="name"
                                type="text"
                                required
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                            <input
                                name="email"
                                type="email"
                                required
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                            <input
                                name="phone"
                                type="tel"
                                required
                                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                placeholder="+1 (555) 000-0000"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                <input
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">I want to be a:</label>
                            <div className="flex space-x-4">
                                <label className={`flex-1 border rounded-lg p-3 cursor-pointer transition-all ${formData.role === 'Passenger' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-200'}`}>
                                    <div className="flex items-center justify-center">
                                        <input
                                            type="radio"
                                            name="role"
                                            value="Passenger"
                                            checked={formData.role === "Passenger"}
                                            onChange={handleChange}
                                            className="sr-only"
                                        />
                                        <span className={`font-medium ${formData.role === 'Passenger' ? 'text-blue-700' : 'text-gray-600'}`}>Passenger</span>
                                    </div>
                                </label>
                                <label className={`flex-1 border rounded-lg p-3 cursor-pointer transition-all ${formData.role === 'Driver' ? 'border-blue-500 bg-blue-50 ring-1 ring-blue-500' : 'border-gray-200 hover:border-blue-200'}`}>
                                    <div className="flex items-center justify-center">
                                        <input
                                            type="radio"
                                            name="role"
                                            value="Driver"
                                            checked={formData.role === "Driver"}
                                            onChange={handleChange}
                                            className="sr-only"
                                        />
                                        <span className={`font-medium ${formData.role === 'Driver' ? 'text-blue-700' : 'text-gray-600'}`}>Driver</span>
                                    </div>
                                </label>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all ${isLoading ? "opacity-75 cursor-not-allowed" : ""
                                }`}
                        >
                            {isLoading ? (
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : null}
                            {isLoading ? "Creating Account..." : "Create Account"}
                        </button>
                    </form>
                </div>
                <div className="px-8 py-4 bg-gray-50 border-t border-gray-100 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
