import { CircularProgress } from 'react-loader-spinner';
import '../styles/Loader.css';

function Loader({ ref }) {
	return (
		<dialog className="loading-dialog" ref={ref}>
			<div className="center-grid">
				<CircularProgress />
			</div>
		</dialog>
	);
}

export default Loader;
