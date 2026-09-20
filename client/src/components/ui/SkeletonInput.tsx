import { Skeleton } from "antd";

type SkeletonInputProps = {
  colSpan?: string;
  inputHeight?: number;
};

const SkeletonInput = ({ colSpan, inputHeight = 40 }: SkeletonInputProps) => {
  return (
    <div className={`${colSpan} flex flex-col gap-2`}>
      <Skeleton.Input active size="small" style={{ height: 16 }} />
      <Skeleton.Input active style={{ height: inputHeight, width: "100%" }} />
    </div>
  );
};

export default SkeletonInput;
