type Props = {
    className?: string;
};

export const Spinner = ({ className }: Props) => {
    return (
        <div className={className}>
            <span className="animate-spin border-4 border-transparent border-l-primary rounded-full w-12 h-12 inline-block align-middle m-auto mb-10"></span>
        </div>
    );
};

export default Spinner;
