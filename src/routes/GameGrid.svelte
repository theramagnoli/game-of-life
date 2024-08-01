<script lang="ts">
	import GameOfLife from '../GameOfLife';
	import { onMount } from 'svelte';

	let dimensions: [number, number] = [25, 50];
	let startingAlive = 100;
	let frameRate = 100;
	let cellSize = 10;
	let blur = 0;
	let game: GameOfLife;
	let error: string | undefined;
	let isPlaying = false;

	let initialValues = {
		dimensions: [...dimensions],
		startingAlive,
		frameRate,
		cellSize,
		blur
	};

	function validateDimensions() {
		error = undefined;
		if (dimensions[0] < 10 || dimensions[1] < 10) {
			error = 'Dimensions must be at least 10x10';
			return false;
		}
		if (dimensions[0] > 150 || dimensions[1] > 150) {
			error = 'Dimensions must be at most 150x150';
			return false;
		}
		if (startingAlive > dimensions[0] * dimensions[1]) {
			error = 'Starting alive must be less than the total number of cells';
			return false;
		}
		if (cellSize < 0.1) {
			error = 'Cell size must be at least 0.1px';
			return false;
		}
		return true;
	}

	function resetGame() {
		game?.stop();
		if (!validateDimensions()) return;
		initialValues = {
			dimensions: [...dimensions],
			startingAlive,
			frameRate,
			cellSize,
			blur
		};
		const gameGrid: HTMLDivElement = document.querySelector('.game-grid')!;
		gameGrid.innerHTML = '';
		game = new GameOfLife({
			height: dimensions[0],
			width: dimensions[1],
			startingAlive,
			baseElement: gameGrid,
			frameRate: frameRate,
			cellSize: cellSize,
			blur: blur
		});
		isPlaying = false;
		game.init();
	}

	onMount(() => {
		resetGame();
	});

	function valueAreDifferentFromGameOnes(
		dimensions: [number, number],
		startingAlive: number,
		frameRate: number,
		cellSize: number,
		blur: number
	) {
		return (
			initialValues.dimensions[0] !== dimensions[0] ||
			initialValues.dimensions[1] !== dimensions[1] ||
			initialValues.startingAlive !== startingAlive ||
			initialValues.frameRate !== frameRate ||
			initialValues.cellSize !== cellSize ||
			initialValues.blur !== blur
		);
	}
	$: if (valueAreDifferentFromGameOnes(dimensions, startingAlive, frameRate, cellSize, blur)) {
		resetGame();
	}
</script>

<div class="two-cols-grid">
	<div>
		<h1>GAME OF LIFE</h1>

		<h3 class="subtitle">Description</h3>
		<p>This is an implementation of the known game of life by <b>John Horton Conway</b>.</p>
		<p>
			It is a zero-player game, meaning that its evolution is determined by its initial state,
			requiring no further input.
		</p>
		<p>
			One interacts with the Game of Life by creating an initial configuration and observing how it
			evolves.
		</p>

		<h3 class="subtitle">Configuration</h3>
		<div class="config">
			<label for="width">Width</label>
			<input type="number" id="width" bind:value={dimensions[0]} />
			<label for="height">Height</label>
			<input type="number" id="height" bind:value={dimensions[1]} />
			<label for="startingAlive">Starting Alive</label>
			<input type="number" id="startingAlive" bind:value={startingAlive} />
		</div>
		<div class="config">
			<label for="frameRate">Frame Rate</label>
			<input type="number" id="frameRate" bind:value={frameRate} />
			<label for="cellSize">Cell Px Size</label>
			<input type="number" id="cellSize" bind:value={cellSize} />
			<label for="blur">Blur</label>
			<input type="number" id="blur" bind:value={blur} />
		</div>
		{#if error}
			<p class="error">{error}</p>
		{/if}
		<h3 class="subtitle">Controls</h3>
		<div class="controls">
			<button
				on:click={() => {
					if (isPlaying) game.stop();
					else game.start();
					isPlaying = !isPlaying;
				}}
			>
				{isPlaying ? 'Stop' : 'Start'}
			</button>
			<button on:click={() => resetGame()}>Reset</button>
		</div>
	</div>
	<div>
		<div class="game-grid" />
	</div>
</div>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Silkscreen&display=swap');
	:root {
		--main-color: cornflowerblue;
		--input-text-color: #333;
	}

	h1 {
		color: cornflowerblue;
		font-size: 4rem;
		margin: 0;
		font-family: 'Silkscreen', monospace;
	}

	.two-cols-grid {
		display: grid;
		grid-template-columns: 2fr 3fr;
		outline: 4px solid var(--main-color);
		height: calc(100vh - 4rem);
		overflow: scroll;
		@media (max-width: 1200px) {
			grid-template-columns: 1fr;
			height: auto;
		}
		& > div {
			padding: 2rem 3rem;
			&:nth-child(1) {
				display: flex;
				flex-direction: column;
				justify-content: start;
				border-right: 4px solid var(--main-color);
				@media (max-width: 1200px) {
					border-right: none;
					border-bottom: 4px solid var(--main-color);
				}
			}
			&:nth-child(2) {
				display: flex;
				justify-content: center;
				align-items: center;
				background: #000;
				overflow: scroll;
			}
		}
	}

	.subtitle {
		font-family: 'Silkscreen', monospace;
		color: aqua;
		font-size: 1.5rem;
		margin-top: 2rem;
		text-transform: uppercase;
		letter-spacing: 0.1rem;
	}

	.game-grid {
		width: 0;
		display: grid;
		outline: 4px solid var(--main-color);
		& > div.cell {
			aspect-ratio: 1;
			&.active {
				background-color: var(--main-color);
			}
		}
	}

	.config {
		display: flex;
		align-items: center;
		gap: 1rem;
		margin-bottom: 1rem;
		@media (max-width: 768px) {
			display: grid;
			grid-template-columns: 1fr 1fr;
		}
		& > input {
			width: 4rem;
			height: 2rem;
			border-radius: 0;
			border: none;
			padding: 0 0.5rem;
			font-size: 1rem;
			font-family: 'Consolas', monospace;
			background: var(--input-text-color);
			color: white;
			&:focus {
				outline: 4px solid white;
			}
		}
	}

	.controls {
		display: flex;
		gap: 1rem;
		margin-bottom: 1rem;
		& > button {
			padding: 0.5rem 1rem;
			border: none;
			background: var(--input-text-color);
			font-family: 'Consolas', monospace;
			color: white;
			font-size: 1rem;
			cursor: pointer;
			&:hover {
				outline: 4px solid white;
			}
		}
	}

	.error {
		color: red;
		font-weight: bold;
		text-decoration: underline;
	}
</style>
