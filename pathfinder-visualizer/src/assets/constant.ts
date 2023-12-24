export const BORD_WIDTH = 80;
export const BORD_HEIGHT = 50;

export const Obstacles = [
    'black',
]

export const AlgorithmOptions = [
    'Dijkstra',
    'A*',
    'Convergent Swarm',
    'Bidirectional Swarm',
]

export const OBSTACLE_POSITION_COLOR = 'black';
export const NEUTRAL_COLOR = 'white';
export const SHORTEST_PATH_COLOR = 'lightblue';

export function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }