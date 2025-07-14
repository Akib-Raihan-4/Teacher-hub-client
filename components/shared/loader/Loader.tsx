type LoaderProps = {
  className?: string;
};

export default function Loader({ className }: LoaderProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="loader">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  );
}
