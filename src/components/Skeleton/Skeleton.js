import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
export const SkeletonCustom = () => {
  return (
    <SkeletonTheme color="rgb(220,220,220)" highlightColor="rgb(220,220,220)">
      <Skeleton height={287} width={287} />
    </SkeletonTheme>
  );
};
