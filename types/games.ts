export interface UpgradeSession {
  id: string
  inputItem: CSGOItem
  targetItems: ItemProbability[]
  multiplier: number
  maxProbability: number
  result?: UpgradeResult
  timestamp: number
  userId?: string
}

export interface UpgradeResult {
  success: boolean
  wonItem?: CSGOItem
  profit: number
  multiplier: number
  probability: number
}

export interface GameSession {
  id: string
  type: GameType
  bet: number
  result?: GameResult
  timestamp: number
  userId?: string
}

export type GameType = 
  | 'roulette'
  | 'coinflip'
  | 'crash'
  | 'case_opening'
  | 'upgrade'

export interface GameResult {
  win: boolean
  payout: number
  profit: number
  details?: any
}

export interface RouletteGame extends GameSession {
  type: 'roulette'
  selectedNumber?: number
  selectedColor?: 'red' | 'black' | 'green'
  winningNumber?: number
}

export interface CoinflipGame extends GameSession {
  type: 'coinflip'
  selectedSide: 'heads' | 'tails'
  result?: 'heads' | 'tails'
}

export interface CrashGame extends GameSession {
  type: 'crash'
  cashOutAt?: number
  crashPoint?: number
  cashedOut: boolean
}