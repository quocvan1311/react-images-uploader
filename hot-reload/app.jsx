/* @flow */
import React, { Component } from 'react';
import ImagesUploader from '../src/index';
import '../src/styles/styles.css';
import '../src/styles/font.css';

export default class App extends Component {
	render() {
		return (
			<div>
				<ImagesUploader
					label="Upload multiple images"
					/>
			</div>
		);
	}
}
