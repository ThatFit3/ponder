function LoadingState() {
    return (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-black bg-opacity-80 z-50">
            <span className="loading loading-dots loading-lg"></span>
            <h1 className="text-xl">Please hold on</h1>
        </div>
    )
}

export default LoadingState