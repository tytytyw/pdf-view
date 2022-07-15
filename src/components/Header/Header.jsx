/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useRef } from 'react'
import styles from './Header.module.sass'
import { ReactComponent as DownloadIcon } from "../../assets/download.svg";
import { ReactComponent as RotateIcon } from "../../assets/rotate.svg";
import classNames from 'classnames';
import FileSaver from 'file-saver'

const Header = ({ pageNumber, numPages, scale, setscale, headerRef, setrotate }) => {

    const [scaleValue, setscaleValue] = useState(Math.round(scale * 100))


    const scaleInputHandler = (e) => {
        let newValue = +e.target.value.replace(/\D/g, '');
        if (isNaN(newValue)) return false

        if (newValue >= 500) {
            newValue = 500
        }

        if (newValue <= 1) {
            newValue = 1
        }
        setscaleValue(newValue)
    }

    const scaleBtnHandler = (value) => {
        setscaleValue(prev => {
            if (prev + value > 500) return 500
            if (prev + value < 10) return 10
            return prev + value
        })
    }

    const rotateHandler = () => {
        setrotate(prev => prev >= 270 ? 0 : prev + 90)
    }

    const downloadFile = () => {

        FileSaver.saveAs(document.PDFdata, document.PDFname);
    }


    useEffect(() => {
        setscale((scaleValue >= 500 ? 500 : scaleValue) / 100)
    }, [scaleValue])

    return (
        <div className={styles.Header} ref={headerRef}>
            <div className={styles.pages}>
                <div className={styles.pageCurrent}>Страниц:</div>
                <span className={styles.slash}> </span>
                <div className={styles.pageLast}>{numPages}</div>
            </div>
            <div className={classNames(styles.scale)}>
                <button
                    onClick={() => scaleBtnHandler(-10)}
                    className={classNames(styles.scaleBtn, styles.minus)}></button>
                <div
                    style={{ width: `${scaleValue.toString().length + 1}ch` }}
                    className={styles.inputWrapper}
                >
                    <input
                        onChange={scaleInputHandler}
                        className={styles.input} value={scaleValue} />
                </div>
                <button
                    onClick={() => scaleBtnHandler(10)}
                    className={classNames(styles.scaleBtn, styles.plus)}></button>
            </div>

            <div className={styles.buttonsWrapper}>
                <div
                    className={classNames(styles.rotate, styles.iconWrapper)}
                    onClick={rotateHandler}
                >
                    <RotateIcon />
                </div>
                <div className={classNames(styles.download, styles.iconWrapper)} onClick={downloadFile}>
                    <DownloadIcon />
                </div>
            </div>
        </div>
    )
}

export default Header