import AdapterSortableTable from './adapterSortabletable';
import {root} from '../../root';

if (!root.SortableTable) {
    require('script-loader!sortabletable');
}

export default AdapterSortableTable;
