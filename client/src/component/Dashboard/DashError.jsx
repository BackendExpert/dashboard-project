import React from "react";
import { AlertTriangle } from "lucide-react";

const DashError = () => {
    return (
        <div className="flex py-16 rounded-xl w-full flex-col items-center justify-center bg-purple-700 text-white p-6">
            <div className="flex flex-col items-center text-center">
                <AlertTriangle className="w-20 h-20 mb-6 text-white animate-bounce" />
                <h1 className="text-6xl font-bold">501</h1>
                <p className="mt-4 text-2xl font-semibold">Not Implemented</p>
                <p className="mt-2 text-lg text-purple-200 max-w-md">
                    The feature you are trying to access is not yet available.
                    Please check back later or contact support for more info.
                </p>
                <button
                    onClick={() => (window.location.href = "/Dashboard")}
                    className="mt-6 px-6 py-3 bg-white text-purple-700 font-semibold rounded-xl shadow hover:bg-purple-100 transition"
                >
                    Go Back Home
                </button>
            </div>
        </div>
    );
};

export default DashError;
