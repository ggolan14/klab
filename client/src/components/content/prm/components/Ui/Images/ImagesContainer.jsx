import {useState, useEffect} from "react";
import {handleImageContainerError} from "./errors";
import Error from "../Error/Error";
import LoadingSpinner from "../../Spinner/LoadingSpinner";

/**
 * type ImagesContainerProps = {
 *     className?: string;
 *     setCurrentImageZoom: Dispatch<SetStateAction<ZoomType>>;
 *     images: UiObjects;
 * }
 */
function ImagesContainer({className, images, setCurrentImageZoom}) {
    const Style = images.style || {};
    const error = handleImageContainerError(images);

    const [loadedCount, setLoadedCount] = useState(0);
    const allLoaded = loadedCount === images.urls.length;

    const handleImageLoad = () => {
        setLoadedCount(prev => prev + 1);
    };

    if (error.isError) {
        return <Error error={error}/>;
    }

    return (
        <div className={`relative w-full ${className}`} style={{minHeight:"200px"}}>

            {!allLoaded && (<div className="absolute-center flex items-center justify-center bg-white z-10"
                                 style={{border: "none"}}>
                </div>
            )}

            <div
                className={`flex justify-center gap-3 flex-row items-center flex-wrap transition-opacity duration-100 ${
                    allLoaded ? "opacity-100" : "opacity-0"
                }`}
            >
                {images.urls.map((url, index) => (
                    <img
                        key={index}
                        src={url}
                        alt="experiment image"
                        style={Style}
                        className="min-w-[175px] max-w-[40%] shadow-none drop-shadow-none"
                        onLoad={handleImageLoad}
                        onClick={() => {
                            if (!setCurrentImageZoom){
                                return;
                            }
                            setCurrentImageZoom(prevState => {
                                const array = [...prevState.zoomOutput];
                                array.push({
                                    time: Date.now() - prevState.startTime,
                                    action: "open",
                                });
                                return {
                                    ...prevState,
                                    image: url,
                                    isOpen: !prevState.isOpen,
                                    zoomOutput: array,
                                };
                            });
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

export default ImagesContainer;
