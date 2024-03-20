const ErrorHandler = (err, req, res, next) => {
    const errStatus = err.status || 500;
    const errMsg = err.message || 'Internal Server Error!';
    res.status(errStatus).json({
        success: false,
        status: errStatus,
        message: errMsg,
    })
}

export default ErrorHandler