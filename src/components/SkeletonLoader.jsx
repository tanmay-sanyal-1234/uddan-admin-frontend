import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { Oval, ThreeDots } from "react-loader-spinner";
import 'react-loading-skeleton/dist/skeleton.css';
const SkeletonLoader = ({ baseColor = "#e0e0e0", highlightColor = "#f5f5f5", count = 1, width = 100, height = 30,additionals={} }) => {
    return (
        <div>
            <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>

                <Skeleton count={count} width={width} height={height}  {...additionals}/>

            </SkeletonTheme>
        </div>
    );
};

export default SkeletonLoader;
