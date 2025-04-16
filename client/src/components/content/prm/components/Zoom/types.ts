export type ZoomType = {
    image: string;
    isOpen: boolean;
    zoomOutput: ZoomElementType[];
    startTime: number;
}

export type ZoomElementType = {
    action: string;
    time: number;
}