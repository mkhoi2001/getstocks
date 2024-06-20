import { ItemHistoryList } from '../../features/item';

type Props = {};

export const ListItems = (props: Props) => {
    return (
        <div className="panel">
            <ItemHistoryList />
        </div>
    );
};

export default ListItems;
