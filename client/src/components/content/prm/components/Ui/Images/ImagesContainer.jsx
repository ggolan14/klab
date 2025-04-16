/**
 * type ImagesContainerProps = {
 *     className?: string;
 *     setCurrentImageZoom: Dispatch<SetStateAction<ZoomType>>;
 *     images: UiObjects;
 * }
 * @param className
 * @param images
 * @param setCurrentImageZoom
 * @returns {JSX.Element}
 * @constructor
 */
function ImagesContainer({className, images, setCurrentImageZoom}) {
    const Style = images.style ? images.style : {};
    return (
        <div
            className={`flex justify-center w-full ${className} gap-3 flex-row items-center flex-wrap`}>
            {images.urls.map((url, index) => (
                <img onClick={() => setCurrentImageZoom(prevState => {
                    const array = [...prevState.zoomOutput];
                    array.push({time: Date.now() - prevState.startTime, action: "open",});
                    return {...prevState, image: url, isOpen: !prevState.isOpen, zoomOutput: array}
                })} src={url} className={"min-w-[175px] max-w-[40%] shadow-none drop-shadow-none"} style={Style} alt="exprement image"
                     key={index}/>
            ))}
        </div>
    );
}

export default ImagesContainer;