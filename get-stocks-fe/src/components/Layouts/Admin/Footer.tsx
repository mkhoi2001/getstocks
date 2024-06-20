import { useSelector } from 'react-redux';
import { IRootState } from '../../../store';
import parse from 'html-react-parser';

const Footer = () => {
    const systemConfig = useSelector((state: IRootState) => state.systemConfig);
    return (
        <div className="mb-0 mt-5">
            {systemConfig?.footer ? (
                parse(systemConfig.footer)
            ) : (
                <p className="dark:text-white-dark text-center ltr:sm:text-left rtl:sm:text-right pt-6">{`© ${new Date().getFullYear()} Getfile - Vsm`}</p>
            )}
        </div>
    );
};

export default Footer;
