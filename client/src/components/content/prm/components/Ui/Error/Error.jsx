/**
 * type ErrorProps=  {
 *     error: ErrorType = {errorMessage:string , isError: boolean};
 * }
 */
/**
 *
 * @param error {{errorMessage:string , isError: boolean}}
 * @returns {JSX.Element}
 * @constructor
 */
function Error({error}) {
    const css = "text-clamping-mid rounded-xl p-5 bg-red-50 border border-white text-center";
    return (
        <h1 className={css}>{error.errorMessage}</h1>
    );
}

export default Error;