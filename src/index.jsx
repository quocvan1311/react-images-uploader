/* @flow */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import classnames from 'classnames';
import Dropzone from 'react-dropzone';
import Button from 'react-progress-button-for-images-uploader';
import 'babel-core/register';
import 'babel-polyfill';

export default class ImagesUploader extends Component {
	/* eslint-disable react/sort-comp */
	state: {
		imagePreviewUrls: Array<string>;
		loadState: string;
		displayNotification: boolean;
	};
	input: ?HTMLInputElement;

	static propTypes = {
		dataName: PropTypes.string,
		headers: PropTypes.object,
		classNamespace: PropTypes.string,
		inputId: PropTypes.string,
		label: PropTypes.string,
		images: PropTypes.array,
		disabled: PropTypes.bool,
		onLoadStart: PropTypes.func,
		onLoadEnd: PropTypes.func,
		deleteImage: PropTypes.func,
		clickImage: PropTypes.func,
		image: PropTypes.string,
		notification: PropTypes.string,
		max: PropTypes.number,
		color: PropTypes.string,
		disabledColor: PropTypes.string,
		borderColor: PropTypes.string,
		disabledBorderColor: PropTypes.string,
		notificationBgColor: PropTypes.string,
		notificationColor: PropTypes.string,
		deleteElement: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.element,
		]),
		plusElement: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.element,
		]),
		classNames: PropTypes.shape({
			container: PropTypes.string,
			label: PropTypes.string,
			deletePreview: PropTypes.string,
			loadContainer: PropTypes.string,
			dropzone: PropTypes.string,
			pseudobutton: PropTypes.string,
			pseudobuttonContent: PropTypes.string,
			imgPreview: PropTypes.string,
			fileInput: PropTypes.string,
			emptyPreview: PropTypes.string,
			filesInputContainer: PropTypes.string,
			notification: PropTypes.string,
		}),
		styles: PropTypes.shape({
			container: PropTypes.object,
			label: PropTypes.object,
			deletePreview: PropTypes.object,
			loadContainer: PropTypes.object,
			dropzone: PropTypes.object,
			pseudobutton: PropTypes.object,
			pseudobuttonContent: PropTypes.object,
			imgPreview: PropTypes.object,
			fileInput: PropTypes.object,
			emptyPreview: PropTypes.object,
			filesInputContainer: PropTypes.object,
			notification: PropTypes.object,
		}),
	}

	static defaultProps = {
		dataName: 'imageFiles',
		headers:{},
		classNames: {},
		styles: {},
		color: '#142434',
		disabledColor: '#bec3c7',
		borderColor: '#a9bac8',
		disabledBorderColor: '#bec3c7',
		notificationBgColor: 'rgba(0, 0, 0, 0.3)',
		notificationColor: '#fafafa',
		classNamespace: 'iu-',
	};

	constructor(props: Object) {
		super(props);
		let imagePreviewUrls = [];
		if (this.props.images) {
			imagePreviewUrls = this.props.images || [];
		}
		this.state = {
			imagePreviewUrls,
			loadState: '',
			displayNotification: false,
		};
		this.input = null;
	}
	/* eslint-enable react/sort-comp */

	componentWillMount() {
		// support SSR rendering.
		// we should not use document on server, so just omit
		// these calls
		if (typeof document !== 'undefined') {
			document.addEventListener('dragover', event => {
				// prevent default to allow drop
				event.preventDefault();
			}, false);
			document.addEventListener('drop', event => {
				// prevent default to allow drop
				event.preventDefault();
			}, false);
		}
	}

	componentWillReceiveProps(nextProps: Object) {
		if (!this.props.images && nextProps.images) {
			this.setState({
				imagePreviewUrls: nextProps.images,
			});
		}
	}



	@autobind
	clickImage(key: number, url: string) {
	    const clickImageCallback = this.props.clickImage;
	    if (clickImageCallback && typeof clickImageCallback === 'function') {
          clickImageCallback(key, url);
      }
	}

	@autobind
	deleteImage(key: number, url: string) {
		if (!this.props.disabled) {
			const imagePreviewUrls = this.state.imagePreviewUrls;
			imagePreviewUrls.splice(key, 1);
			this.setState({
				imagePreviewUrls,
			});
			if (this.props.deleteImage && typeof this.props.deleteImage === 'function') {
				this.props.deleteImage(key, url);
			}
		}
	}

	@autobind
	buildPreviews(urls: Array<string>) {
		const {
			classNamespace,
			disabled,
			classNames,
			styles,
			color,
			disabledColor,
			borderColor,
			disabledBorderColor,
			deleteElement,
		} = this.props;

		if (!urls || urls.length < 1) {
			return (
				<div
					className={classNames.emptyPreview || `${classNamespace}emptyPreview`}
					style={styles.emptyPreview}
					/>
			);
		}
		let previews = [];
		if (urls
			&& urls.length > 0) {
			previews = urls.map((url, key) => {
				if (url) {
					let imgPreviewStyle = {
						backgroundImage: `url(${url})`,
						borderColor: disabled ? disabledBorderColor : borderColor,
					};

					if (this.props.size) {
						imgPreviewStyle = {
							...imgPreviewStyle,
							...{
								width: this.props.size,
								height: this.props.size,
							},
							...(styles.imagePreview || {}),
						};
					}

					const deletePreviewStyle = {
						...{
							color: disabled ? disabledColor : color,
							borderColor: disabled ? disabledBorderColor : borderColor,
						},
						...(styles.deletePreview || {}),
					};

					return (
						<div
							className={classNames.imgPreview || `${classNamespace}imgPreview`}
							key={key}
							style={imgPreviewStyle}
					        onClick={(e) => {
					            e.preventDefault();
					            this.clickImage(key, url)
					        }}>
							{<div
								className={classNames.deletePreview || `${classNamespace}deletePreview`}
								style={deletePreviewStyle}
								onClick={(e) => {
									e.preventDefault();
									e.stopPropagation();
									this.deleteImage(key, url);
								}}>
								{deleteElement
								|| (<svg xmlns="http://www.w3.org/2000/svg" width="7.969" height="8" viewBox="0 0 7.969 8">
									<path
										id="X_Icon"
										data-name="X Icon"
										style={{
											fill: disabled ? disabledColor : color,
											fillRule: 'evenodd',
										}}
										/* eslint-disable max-len */
										d="M562.036,606l2.849-2.863a0.247,0.247,0,0,0,0-.352l-0.7-.706a0.246,0.246,0,0,0-.352,0l-2.849,2.862-2.849-2.862a0.247,0.247,0,0,0-.352,0l-0.7.706a0.249,0.249,0,0,0,0,.352L559.927,606l-2.849,2.862a0.25,0.25,0,0,0,0,.353l0.7,0.706a0.249,0.249,0,0,0,.352,0l2.849-2.862,2.849,2.862a0.249,0.249,0,0,0,.352,0l0.7-.706a0.25,0.25,0,0,0,0-.353Z"
										/* eslint-enable max-len */
										transform="translate(-557 -602)"
										/>
								</svg>)}
							</div>}
						</div>
					);
				}
				return null;
			});
		}
		return previews;
	}

	@autobind
	handleImageChange(e: Object) {
		e.preventDefault();

		const filesList = e.target.files;
		const { onLoadStart, onLoadEnd } = this.props;

		if (onLoadStart && typeof onLoadStart === 'function') {
			onLoadStart();
		}

		this.setState({
			loadState: 'loading',
		});

		if (this.props.max
			&& (filesList.length + this.state.imagePreviewUrls.length) > this.props.max
		) {
			const err = {
				message: 'exceeded the number',
			};
			this.setState({
				loadState: 'error',
			});
			if (onLoadEnd && typeof onLoadEnd === 'function') {
				onLoadEnd(err);
			}
			return;
    }
    
    let imagePreviewUrls = this.state.imagePreviewUrls;
    let count = 0;
    let result = [];
		for (let i = 0; i < filesList.length; i++) {
      const file = filesList[i];
      if (!file.type.match('image.*')) {
        alert('File type error')
				const err = {
					message: 'file type error',
					type: file.type,
					fileName: 'ImagesUploader',
				};
				if (onLoadEnd && typeof onLoadEnd === 'function') {
					onLoadEnd(err);
				}
				this.setState({
					loadState: 'error',
				});
				return;
			}
      
			const reader = new FileReader();
      reader.onload = (upload) => {
        count++;
        imagePreviewUrls = imagePreviewUrls.concat(upload.target.result);
        result[i] = upload.target;
        if (count === filesList.length) {
          this.setState({
            imagePreviewUrls,
            loadState: 'success',
          });
          if (onLoadEnd && typeof onLoadEnd === 'function') {
            onLoadEnd(false, result);
          }
        }
      };
      reader.readAsDataURL(file);
		}
	}

	@autobind
	handleFileDrop(files: FileList) {
		if (!this.props.disabled) {
			this.handleImageChange({
				preventDefault: () => true,
				target: {
					files,
				},
			});
		}
	}

	/* eslint-disable max-len, no-undef */
	buildPlus(
		disabled: boolean,
		color: string,
		disabledColor: string,
		plusElement?: string|React$Element<*>
	) {
		return plusElement || (
			<svg
				version="1.1"
				xmlns="http://www.w3.org/2000/svg"
				style={{
					width: 35,
					fill: disabled ? disabledColor : color,
				}}
				xmlnsXlink="http://www.w3.org/1999/xlink"
				x="0px"
				y="0px"
				viewBox="0 0 1000 1000"
				enableBackground="new 0 0 1000 1000"
				xmlSpace="preserve">
				<g>
					<path
						d="M500,10c13.5,0,25.1,4.8,34.7,14.4C544.2,33.9,549,45.5,549,59v392h392c13.5,0,25.1,4.8,34.7,14.4c9.6,9.6,14.4,21.1,14.4,34.7c0,13.5-4.8,25.1-14.4,34.6c-9.6,9.6-21.1,14.4-34.7,14.4H549v392c0,13.5-4.8,25.1-14.4,34.7c-9.6,9.6-21.1,14.4-34.7,14.4c-13.5,0-25.1-4.8-34.7-14.4c-9.6-9.6-14.4-21.1-14.4-34.7V549H59c-13.5,0-25.1-4.8-34.7-14.4C14.8,525.1,10,513.5,10,500c0-13.5,4.8-25.1,14.4-34.7C33.9,455.8,45.5,451,59,451h392V59c0-13.5,4.8-25.1,14.4-34.7C474.9,14.8,486.5,10,500,10L500,10z"
						/>
				</g>
			</svg>
		);
	}
	/* eslint-enable max-len, no-undef */

	@autobind
	buildButtonContent() {
		const {
			classNamespace,
			disabled,
			classNames,
			styles,
			color,
			disabledColor,
			plusElement,
		} = this.props;

		const pseudobuttonContentStyle = {
			...{
				color: disabled ? disabledColor : color,
			},
			...(styles.pseudobuttonContent),
		};

		return (
      <span
        className={classNames.pseudobuttonContent || `${classNamespace}pseudobuttonContent`}
        style={pseudobuttonContentStyle}>
        {this.buildPlus(disabled, color, disabledColor, plusElement)}
      </span>
    );
	}

	render() {
		const { imagePreviewUrls, loadState } = this.state;
		const {
			inputId,
			disabled,
			label,
			size,
			classNamespace,
			classNames,
			styles,
			color,
			disabledColor,
			borderColor,
			disabledBorderColor,
		} = this.props;

		const containerClassNames = classnames({
			[classNames.container || `${classNamespace}container`]: true,
			disabled,
		});

		const loadContainerStyle = {
			...(size ? {
				width: size,
				height: size,
			} : {}),
			...{
				color: disabled ? disabledColor : color,
			},
			...(styles.loadContainer || {}),
		};

		const pseudobuttonStyle = {
			...(size ? {
				width: size,
				height: size,
			} : {}),
			...{
				color: disabled ? disabledColor : color,
			},
			...(styles.pseudobuttonStyle || {}),
		};

		const labelStyle = {
			...{
				color: disabled ? disabledColor : color,
			},
			...(styles.label || {}),
		};

		const dropzoneStyle = {
			...{
				borderColor: disabled ? disabledBorderColor : borderColor,
			},
			...(styles.dropzone || {}),
		};

		return (
			<div className={containerClassNames} style={styles.container || {}}>
				<label
					className={classNames.label || `${classNamespace}label`}
					style={labelStyle}>
					{label || null}
				</label>
				<div
					className={classNames.filesInputContainer || `${classNamespace}filesInputContainer`}
					style={styles.filesInputContainer}>
					<div
						className={classNames.loadContainer || `${classNamespace}loadContainer`}
						style={loadContainerStyle}>
						<Dropzone
							onDrop={this.handleFileDrop}
							disableClick
							accept="image/*"
							className={classNames.dropzone || `${classNamespace}dropzone`}
							style={dropzoneStyle}
							multiple={true}>
							<Button
								state={loadState}
								type="button"
								classNamespace={`${classNamespace}button-`}
								className={classNames.pseudobutton || `${classNamespace}pseudobutton`}
								style={pseudobuttonStyle}
								onClick={(e) => {
									e.preventDefault();
									if (this.input) {
										this.input.click();
									}
								}}>
								{this.buildButtonContent()}
							</Button>
						</Dropzone>
					</div>
					<input
						name={inputId || 'filesInput'}
						id={inputId || 'filesInput'}
						className={classNames.fileInput || `${classNamespace}fileInput`}
						style={{
							...{
								display: 'none',
							},
							...(styles.fileInput || {}),
						}}
						ref={(ref) => {
							this.input = ref;
						}}
						type="file"
						accept="image/*"
						multiple="multiple"
						disabled={disabled || loadState === 'loading'}
						onChange={this.handleImageChange}
						/>
				</div>
				{this.buildPreviews(imagePreviewUrls)}
			</div>
		);
	}
}
