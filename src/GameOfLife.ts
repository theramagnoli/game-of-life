type GameOfLifeConfig = {
	height: number;
	width: number;
	startingAlive: number;
	baseElement: HTMLElement;
	frameRate?: number;
	cellSize?: number;
	blur?: number;
};

class GameOfLife {
	private readonly height: number;
	private readonly width: number;
	private readonly startingAlive: number;
	private baseElement: HTMLElement;
	private readonly cells: Cell[][];
	private readonly cellStates: boolean[][] = [];
	private interval: any;
	private readonly frameRate: number;
	private readonly cellSize: number;
	private readonly blur: number;

	constructor(config: GameOfLifeConfig) {
		this.height = config.height;
		this.width = config.width;
		this.startingAlive = config.startingAlive;
		this.baseElement = config.baseElement;
		this.frameRate = config.frameRate || 100;
		this.cellSize = config.cellSize || 20;
		this.blur = config.blur || 0;
		this.cells = [];
	}

	private create() {
		this.baseElement.style.display = 'grid';
		this.baseElement.style.gridTemplateColumns = `repeat(${this.width}, ${this.cellSize}px)`;
		this.baseElement.style.gridTemplateRows = `repeat(${this.height}, ${this.cellSize}px)`;
		this.baseElement.style.height = `${this.height * this.cellSize}px`;
		this.baseElement.style.width = `${this.width * this.cellSize}px`;
		// this.baseElement.style.filter = `blur(${this.blur}px)`;
		for (let i = 0; i < this.height; i++) {
			const row = [];
			const rowState = [];
			for (let j = 0; j < this.width; j++) {
				const cell = new Cell(this.blur);
				this.baseElement.appendChild(cell.element);
				row.push(cell);
				rowState.push(false);
			}
			this.cells.push(row);
			this.cellStates.push(rowState);
		}
	}

	private getRandomStartPoints(noOfPoints: number) {
		const startPoints: [number, number][] = [];
		while (startPoints.length < noOfPoints) {
			const row = Math.floor(Math.random() * this.height);
			const column = Math.floor(Math.random() * this.width);
			if (!startPoints.some((point) => point[0] === row && point[1] === column)) {
				startPoints.push([row, column]);
			}
		}
		return startPoints;
	}

	private getActiveNeighbours(coords: [number, number]) {
		let activeNeighbours = 0;
		const row = coords[0];
		const column = coords[1];
		if (row - 1 >= 0 && column - 1 >= 0)
			if (this.cellStates[row - 1][column - 1]) activeNeighbours++;
		if (row - 1 >= 0) if (this.cellStates[row - 1][column]) activeNeighbours++;
		if (row - 1 >= 0 && column + 1 < this.width)
			if (this.cellStates[row - 1][column + 1]) activeNeighbours++;
		if (column - 1 >= 0) if (this.cellStates[row][column - 1]) activeNeighbours++;
		if (column + 1 < this.width) if (this.cellStates[row][column + 1]) activeNeighbours++;
		if (row + 1 < this.height && column - 1 >= 0)
			if (this.cellStates[row + 1][column - 1]) activeNeighbours++;
		if (row + 1 < this.height) if (this.cellStates[row + 1][column]) activeNeighbours++;
		if (row + 1 < this.height && column + 1 < this.width)
			if (this.cellStates[row + 1][column + 1]) activeNeighbours++;
		return activeNeighbours;
	}
	private update() {
		const newCellStates = [];
		for (let i = 0; i < this.height; i++) {
			const row = [];
			for (let j = 0; j < this.width; j++) {
				row.push(false);
			}
			newCellStates.push(row);
		}
		for (let i = 0; i < this.height; i++) {
			for (let j = 0; j < this.width; j++) {
				const activeNeighbours = this.getActiveNeighbours([i, j]);
				if (this.cellStates[i][j]) {
					if (activeNeighbours === 2 || activeNeighbours === 3) {
						newCellStates[i][j] = true;
					}
				} else if (activeNeighbours === 3) {
					newCellStates[i][j] = true;
				}
			}
		}
		this.cellStates.splice(0, this.cellStates.length);
		for (const row of newCellStates) {
			this.cellStates.push(row);
		}
		for (let i = 0; i < this.height; i++) {
			for (let j = 0; j < this.width; j++) {
				if (this.cellStates[i][j]) {
					this.cells[i][j].element.classList.add('active');
				} else {
					this.cells[i][j].element.classList.remove('active');
				}
			}
		}
	}

	public init() {
		this.create();
		const startPoints = this.getRandomStartPoints(this.startingAlive);
		for (const point of startPoints) {
			this.cellStates[point[0]][point[1]] = true;
			this.cells[point[0]][point[1]].element.classList.add('active');
		}
	}

	public start() {
		this.interval = setInterval(() => {
			this.update();
		}, this.frameRate);
	}

	public stop() {
		clearInterval(this.interval);
	}
}

class Cell {
	private readonly _element: HTMLElement;
	constructor(blur = 0) {
		this._element = document.createElement('div');
		this._element.classList.add('cell');
		this._element.style.filter = `blur(${blur}px)`;
	}

	get element() {
		return this._element;
	}
}

export default GameOfLife;
