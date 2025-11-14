import styles from "./LoadingSkeletonSection.module.scss"

export default function LoadingSkeletonSection(props: {width: string, height: string}) {
  return (
    <div className={styles['skeleton']} style={{ width: props.width, height: props.height }}></div>
  );
}