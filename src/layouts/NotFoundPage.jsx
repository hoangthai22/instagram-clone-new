import React from "react";

const NotFoundPage = () => {
    return (
        <section className="flex items-center h-full p-16 dark:bg-gray-900 dark:text-gray-100">
            <div className="container flex flex-col items-center justify-center px-5 mx-auto my-8">
                <div className="max-w-md text-center">
                    <h2 className="mb-8 font-extrabold text-9xl dark:text-gray-600">
                        <span className="sr-only">Error</span>404
                    </h2>
                    <p className="text-2xl font-semibold md:text-3xl">Sorry, we couldn't find this page.</p>
                    <p className="mt-4 mb-8 dark:text-gray-400">But dont worry, you can find plenty of other things on our homepage.</p>
                    <a
                        href="/"
                        className=" dark:bg-violet-400 dark:text-gray-900 flex flex-1 justify-center items-center h-10 px-6 py-2.5
                                                                        bg-gradient-to-r from-sky-600 to-cyan-400
                                                                        text-white font-medium text-xs leading-tight uppercase rounded shadow-md
                                                                        hover:bg-sky-600 hover:shadow-lg
                                                                        focus:bg-sky-600 focus:shadow-lg focus:outline-none focus:ring-0
                                                                        active:bg-sky-600 active:shadow-lg transition duration-150 ease-in-out"
                    >
                        Back to homepage
                    </a>
                </div>
            </div>
        </section>
    );
};

export default NotFoundPage;
