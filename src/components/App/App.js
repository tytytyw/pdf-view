import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
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
	const headerRef = useRef();
	const documentRef = useRef();


	const headerHeight = headerRef.current?.clientHeight ?? 0
	// const appWidth = pageRef.current?.scrollHeight ?? 0


	function onDocumentLoadSuccess({ numPages }) {
		setNumPages(numPages);
	}

	const documentScrollhandler = (e) => {
		const documentHeight = document.documentElement.offsetHeight - headerHeight
		const pageHeight = (document.documentElement.offsetHeight - headerHeight) / (numPages)
		const yOffset = e.view.pageYOffset + e.deltaY > 0 ? e.view.pageYOffset + e.deltaY : 0
		const currentPage = Math.ceil(((yOffset + pageHeight / 2) / documentHeight) * numPages)

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


	return (
		<div className={styles.App}>
			<Header
				pageNumber={pageNumber}
				numPages={numPages}
				scale={scale}
				headerRef={headerRef}
				setscale={setscale}
			/>
			<div
				ref={documentRef}
				style={{ marginTop: headerHeight }} onWheel={documentScrollhandler}>
				<Document
					file={document.PDFdata}
					onLoadSuccess={onDocumentLoadSuccess}
					className={styles.Document}
					height={100}
				>
					{arrayPages.map((pageNumber, i) => <Page key={pageNumber} className={styles.Page} scale={scale} pageNumber={pageNumber} />)}



				</Document>
			</div>

		</div>
	);
}

export default App;
