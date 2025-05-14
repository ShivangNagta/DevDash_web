import React from 'react';
import { Canvas } from "@react-three/fiber";
import { useGLTF, Stage, OrbitControls } from "@react-three/drei";
import { useState, useEffect, useContext } from "react";
import { SampleContext } from '../../contexts/URLContext';

function Model(props) {
    const { scene } = useGLTF("2.glb"); // Ensure the path is correct
    // Adjust the rotation here (example values: [x, y, z])
    const initialRotation = [0, -(Math.PI / 2), 0]; // 90 degrees around the x-axis
    return <primitive object={scene} scale={0.015} rotation={initialRotation} {...props} />;
}

function Login() {
    const { URL } = useContext(SampleContext);

    const [controlSettings, setControlSettings] = useState({
        speed: 3.0,
        damping: 0.1,
    });

    const [name, setName] = useState("");
    const [entryNumber, setEntryNumber] = useState("");
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [adminPassword, setAdminPassword] = useState("");

    useEffect(() => {
        const handleResize = () => {
            if (window.matchMedia("(max-width: 768px)").matches) {
                setControlSettings({
                    speed: 6.0, // Increase speed for mobile
                    damping: 0.2, // Increase damping for mobile
                });
            } else {
                setControlSettings({
                    speed: 3.0, // Default speed for desktop
                    damping: 0.1, // Default damping for desktop
                });
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize(); // Initial check
        
        // Allow scrolling but prevent bounce effects on iOS
        document.body.style.overflow = 'auto';
        document.body.style.overscrollBehavior = 'none';

        return () => {
            window.removeEventListener("resize", handleResize);
            document.body.style.overflow = '';
            document.body.style.overscrollBehavior = '';
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const date = new Date();

        let day = date.getDate();
        let month = date.getMonth() + 1; // Months are zero-based, so add 1
        let year = date.getFullYear();
        let currentDate = `${day}-${month}-${year}`;

        // Create an object to hold the form data
        const formData = {
            name: name,
            entryNumber: entryNumber,
            date: currentDate,
            time: 0 // You can add other fields as needed
        };

        try {
            // Send the form data as a JSON string
            let result = await fetch(`${URL}/`, {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            // Handle the response
            result = await result.json();
            console.log("Name:", name);
            console.log("Entry Number:", entryNumber);
            window.location.href = `/intro1?entryNumber=${entryNumber}`;
        } catch (error) {
            console.error("Error submitting form:", error);
            // Handle error appropriately
        }
    };

    const handleAdminSubmit = (e) => {
        e.preventDefault();
        if (adminPassword === "password") {  // Replace with actual admin password
            window.location.href = "/resultPage";
        } else {
            alert("Incorrect password");
        }
    };

    return (
        <div className="min-h-full bg-black text-white flex flex-col">
            <header className="w-full p-4">
                <h1 className="text-center text-gray-900 dark:text-white text-3xl sm:text-4xl lg:text-5xl">SoftCom - DevDash</h1>
                <h2 className="text-center text-gray-700 dark:text-white text-xl sm:text-2xl">IIT Ropar</h2>
            </header>
            {/* 3D Model Canvas - responsive height */}
            <div className="w-full h-64 sm:h-64 md:h-80 lg:h-96">
                <Canvas dpr={[1, 2]} shadows camera={{ fov: 45, position: [2, 1, 2] }} className="w-full h-full">
                    <color attach="background" args={["#000000"]} />
                    <OrbitControls
                        enableZoom={false}
                        minPolarAngle={Math.PI / 4}
                        maxPolarAngle={Math.PI / 2}
                        autoRotate
                        autoRotateSpeed={1.0}
                    />
                    <Stage environment={null}>
                        <Model scale={0.015} />
                    </Stage>
                </Canvas>
            </div>
            
            {/* Form container - centered and responsive */}
            <div className="flex-grow flex flex-col items-center justify-center px-4 py-6">
                <form onSubmit={handleSubmit} className="w-full max-w-md">
                    <div className="mb-4">
                        <label htmlFor="Name" className="block mb-2 text-sm font-medium text-white">Name</label>
                        <input
                            type="text"
                            id="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="entryNumber" className="block mb-2 text-sm font-medium text-white">Entry Number</label>
                        <input
                            type="text"
                            id="entryNumber"
                            value={entryNumber}
                            onChange={(e) => setEntryNumber(e.target.value)}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="mb-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        Submit
                    </button>
                </form>
                <button
                    onClick={() => setShowAdminModal(true)}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm w-full max-w-md px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 mt-2"
                >
                    Admin Login
                </button>
            </div>

            {/* Admin Modal - fixed color issues and positioning */}
            {showAdminModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4 text-black">Admin Login</h2>
                        <form onSubmit={handleAdminSubmit}>
                            <input
                                type="password"
                                value={adminPassword}
                                onChange={(e) => setAdminPassword(e.target.value)}
                                placeholder="Enter admin password"
                                className="mb-4 w-full p-2 border border-gray-300 rounded text-black bg-white"
                            />
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => setShowAdminModal(false)}
                                    className="mr-2 px-4 py-2 bg-gray-200 text-black rounded hover:bg-gray-300"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Login
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Login;