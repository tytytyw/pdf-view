import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Document, Page, pdfjs } from "react-pdf";
import pdfjsWorker from "react-pdf/node_modules/pdfjs-dist/build/pdf.worker.entry";
import Header from '../Header/Header';
import styles from "./App.module.sass"

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

function App() {
	const [numPages, setNumPages] = useState(0);
	const [arrayPages, setArrayPages] = useState([]);
	const [pageNumber, setPageNumber] = useState(1);
	const [scale, setscale] = useState(1);
	const [rotate, setrotate] = useState(0)
	const [isError, setIsError] = useState(false)

	const headerRef = useRef();
	const documentRef = useRef();
	const headerHeight = headerRef.current?.clientHeight ?? 0

	function onDocumentLoadSuccess({ numPages }) {
		setNumPages(numPages);
	}

	const documentScrollhandler = (e) => {
		const documentHeight = documentRef?.current?.scrollHeight ?? 0
		const visibleContentHight = documentRef?.current?.clientHeight ?? 0
		const pageHeight = documentHeight / numPages;
		const maxOffSet = documentHeight - visibleContentHight
		const yOffset = documentRef.current.scrollTop + e.deltaY > 0 ? documentRef.current.scrollTop + e.deltaY > maxOffSet ? maxOffSet : documentRef.current.scrollTop + e.deltaY : 0
		const currentPage = Math.floor((yOffset / pageHeight) + (visibleContentHight / pageHeight) / 2) + 1

		setPageNumber(currentPage > 0 ? currentPage > numPages ? numPages : currentPage : 1)
	}

	useEffect(() => {
		if (numPages) {
			const newArrayPages = [];
			for (let i = 1; i <= numPages; i++) {
				newArrayPages.push(i)
			}
			setArrayPages(newArrayPages)
		}
	}, [numPages])


	const pages = () =>
		arrayPages.map((pageNumber) => <Page
			key={pageNumber}
			className={styles.Page}
			scale={scale}
			pageNumber={pageNumber}
			rotate={rotate}
			width={documentRef?.current.offsetWidth * 90 / 100}
		/>)

	return (
		<div className={styles.App}>
			{!isError ? <Header
				pageNumber={pageNumber}
				numPages={numPages}
				scale={scale}
				headerRef={headerRef}
				setscale={setscale}
				setrotate={setrotate}
			/> : ''}
			{!isError ? <div
				ref={documentRef}
				style={{ marginTop: headerHeight, maxWidth: '100vw', maxHeight: `calc( 100vh - ${headerHeight}px )`, overflow: 'auto' }} onWheel={documentScrollhandler}>
				<Document
					file={document.PDFdata}
					onLoadSuccess={onDocumentLoadSuccess}
					onSourceError={() => setIsError(true)}
					onLoadError={() => setIsError(true)}
					className={styles.Document}
				>
					{pages()}
				</Document>
			</div> :
				<p className={styles.error}>Ошибка открытия файла</p>
			}

		</div>
	);
}

export default App;
