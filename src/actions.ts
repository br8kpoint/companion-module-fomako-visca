import type { CompanionActionDefinitions, CompanionActionEvent } from '@companion-module/base'
import { FomakoActionId } from './actions-enum.js'
import {
	AutoTracking,
	AutoWhiteBalanceSensitivity,
	CameraPower,
	ExposureMode,
	FocusFarStandard,
	FocusLock,
	FocusMode,
	FocusNearStandard,
	FocusStop,
	FocusUnlock,
	IrisDown,
	IrisSet,
	IrisUp,
	OnScreenDisplayBack,
	OnScreenDisplayClose,
	OnScreenDisplayEnter,
	OnScreenDisplayNavigate,
	OnScreenDisplayToggle,
	PanTiltAction,
	PanTiltDirection,
	PanTiltHome,
	PresetDriveSpeed,
	PresetRecall,
	PresetSave,
	ShutterDown,
	ShutterSet,
	ShutterUp,
	WhiteBalance,
	WhiteBalanceOnePushTrigger,
	ZoomIn,
	ZoomOut,
	ZoomStop,
	sendPanTiltCommand,
} from './camera/commands.js'
import { ExposureModeInquiry, FocusModeInquiry, OnScreenDisplayInquiry } from './camera/inquiries.js'
import {
	AutoTrackingOption,
	AutoWhiteBalanceSensitivityOption,
	CameraPowerOption,
	ExposureModeOption,
	FocusModeOption,
	IrisSetOption,
	OnScreenDisplayNavigateOption,
	OnScreenDisplayOption,
	PanTiltSetSpeedOption,
	PresetDriveNumberOption,
	PresetDriveSpeedOption,
	PresetRecallOption,
	PresetSaveOption,
	ShutterSetOption,
	WhiteBalanceOption,
} from './camera/options.js'
import { generateCustomCommandAction } from './custom-command-action.js'
import type { FomakoInstance } from './instance.js'

export function getActions(instance: FomakoInstance): CompanionActionDefinitions {
	function createPanTiltCallback(direction: readonly [number, number]) {
		return async (_event: CompanionActionEvent) => {
			const { panSpeed, tiltSpeed } = instance.panTiltSpeed()
			void sendPanTiltCommand(instance, direction, panSpeed, tiltSpeed)
		}
	}

	const actionDefinitions: CompanionActionDefinitions = {
		[FomakoActionId.PanTiltLeft]: {
			name: 'Pan Left',
			options: [],
			callback: createPanTiltCallback(PanTiltDirection[PanTiltAction.Left]),
		},
		[FomakoActionId.PanTiltRight]: {
			name: 'Pan Right',
			options: [],
			callback: createPanTiltCallback(PanTiltDirection[PanTiltAction.Right]),
		},
		[FomakoActionId.PanTiltUp]: {
			name: 'Tilt Up',
			options: [],
			callback: createPanTiltCallback(PanTiltDirection[PanTiltAction.Up]),
		},
		[FomakoActionId.PanTiltDown]: {
			name: 'Tilt Down',
			options: [],
			callback: createPanTiltCallback(PanTiltDirection[PanTiltAction.Down]),
		},
		[FomakoActionId.PanTiltUpLeft]: {
			name: 'Up Left',
			options: [],
			callback: createPanTiltCallback(PanTiltDirection[PanTiltAction.UpLeft]),
		},
		[FomakoActionId.PanTiltUpRight]: {
			name: 'Up Right',
			options: [],
			callback: createPanTiltCallback(PanTiltDirection[PanTiltAction.UpRight]),
		},
		[FomakoActionId.PanTiltDownLeft]: {
			name: 'Down Left',
			options: [],
			callback: createPanTiltCallback(PanTiltDirection[PanTiltAction.DownLeft]),
		},
		[FomakoActionId.PanTiltDownRight]: {
			name: 'Down Right',
			options: [],
			callback: createPanTiltCallback(PanTiltDirection[PanTiltAction.DownRight]),
		},
		[FomakoActionId.PanTiltStop]: {
			name: 'P/T Stop',
			options: [],
			callback: createPanTiltCallback(PanTiltDirection[PanTiltAction.Stop]),
		},
		[FomakoActionId.PanTiltHome]: {
			name: 'P/T Home',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				void instance.sendCommand(PanTiltHome)
			},
		},
		[FomakoActionId.PanTiltSetSpeed]: {
			name: 'P/T Speed',
			options: [
				{
					type: 'dropdown',
					label: 'speed setting',
					id: PanTiltSetSpeedOption.id,
					choices: PanTiltSetSpeedOption.choices,
					default: PanTiltSetSpeedOption.default,
				},
			],
			callback: async (event: CompanionActionEvent) => {
				const speed = parseInt(String(event.options['speed']), 16)
				instance.setPanTiltSpeed(speed)
			},
		},
		[FomakoActionId.PanTiltSpeedUp]: {
			name: 'P/T Speed Up',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				instance.increasePanTiltSpeed()
			},
		},
		[FomakoActionId.PanTiltSpeedDown]: {
			name: 'P/T Speed Down',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				instance.decreasePanTiltSpeed()
			},
		},
		[FomakoActionId.StartZoomIn]: {
			name: 'Zoom In',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				void instance.sendCommand(ZoomIn)
			},
		},
		[FomakoActionId.StartZoomOut]: {
			name: 'Zoom Out',
			options: [],
			callback: async (event: CompanionActionEvent) => {
				void instance.sendCommand(ZoomOut, event.options)
			},
		},
		[FomakoActionId.StopZoom]: {
			name: 'Zoom Stop',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				void instance.sendCommand(ZoomStop)
			},
		},
		[FomakoActionId.StartFocusNearer]: {
			name: 'Focus Near',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				void instance.sendCommand(FocusNearStandard)
			},
		},
		[FomakoActionId.StartFocusFarther]: {
			name: 'Focus Far',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				void instance.sendCommand(FocusFarStandard)
			},
		},
		[FomakoActionId.StopFocus]: {
			name: 'Focus Stop',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				void instance.sendCommand(FocusStop)
			},
		},
		[FomakoActionId.SelectFocusMode]: {
			name: 'Focus Mode',
			options: [
				{
					type: 'dropdown',
					label: 'Auto / Manual Focus',
					id: FocusModeOption.id,
					choices: FocusModeOption.choices,
					default: FocusModeOption.default,
				},
			],
			callback: async (event: CompanionActionEvent) => {
				void instance.sendCommand(FocusMode, event.options)
			},
			learn: async (_event: CompanionActionEvent) => {
				const opts = await instance.sendInquiry(FocusModeInquiry)
				if (opts === null) return undefined
				return { ...opts }
			},
		},
		[FomakoActionId.LockFocus]: {
			name: 'Focus Lock',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				void instance.sendCommand(FocusLock)
			},
		},
		[FomakoActionId.UnlockFocus]: {
			name: 'Focus Unlock',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				void instance.sendCommand(FocusUnlock)
			},
		},
		[FomakoActionId.SelectExposureMode]: {
			name: 'Exposure Mode',
			options: [
				{
					type: 'dropdown',
					label: 'Mode setting',
					id: ExposureModeOption.id,
					choices: ExposureModeOption.choices,
					default: ExposureModeOption.default,
				},
			],
			callback: async (event: CompanionActionEvent) => {
				void instance.sendCommand(ExposureMode, event.options)
			},
			learn: async (_event: CompanionActionEvent) => {
				const opts = await instance.sendInquiry(ExposureModeInquiry)
				if (opts === null) return undefined
				return { ...opts }
			},
		},
		[FomakoActionId.IrisUp]: {
			name: 'Iris Up',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				void instance.sendCommand(IrisUp)
			},
		},
		[FomakoActionId.IrisDown]: {
			name: 'Iris Down',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				void instance.sendCommand(IrisDown)
			},
		},
		[FomakoActionId.SetIris]: {
			name: 'Set Iris',
			options: [
				{
					type: 'dropdown',
					label: 'Iris setting',
					id: IrisSetOption.id,
					choices: IrisSetOption.choices,
					default: IrisSetOption.default,
				},
			],
			callback: async (event: CompanionActionEvent) => {
				void instance.sendCommand(IrisSet, event.options)
			},
		},
		[FomakoActionId.ShutterUp]: {
			name: 'Shutter Up',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				void instance.sendCommand(ShutterUp)
			},
		},
		[FomakoActionId.ShutterDown]: {
			name: 'Shutter Down',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				void instance.sendCommand(ShutterDown)
			},
		},
		[FomakoActionId.SetShutter]: {
			name: 'Set Shutter',
			options: [
				{
					type: 'dropdown',
					label: 'Shutter setting',
					id: ShutterSetOption.id,
					choices: ShutterSetOption.choices,
					default: ShutterSetOption.default,
				},
			],
			callback: async (event: CompanionActionEvent) => {
				void instance.sendCommand(ShutterSet, event.options)
			},
		},
		[FomakoActionId.SetPreset]: {
			name: 'Save Preset',
			options: [
				{
					type: 'dropdown',
					label: 'Preset Nr.',
					id: PresetSaveOption.id,
					choices: PresetSaveOption.choices,
					minChoicesForSearch: 1,
					default: PresetSaveOption.default,
				},
			],
			callback: async (event: CompanionActionEvent) => {
				void instance.sendCommand(PresetSave, event.options)
			},
		},
		[FomakoActionId.RecallPreset]: {
			name: 'Recall Preset',
			options: [
				{
					type: 'dropdown',
					label: 'Preset Nr.',
					id: PresetRecallOption.id,
					choices: PresetRecallOption.choices,
					minChoicesForSearch: 1,
					default: PresetRecallOption.default,
				},
			],
			callback: async (event: CompanionActionEvent) => {
				void instance.sendCommand(PresetRecall, event.options)
			},
		},
		[FomakoActionId.SetPresetDriveSpeed]: {
			name: 'Preset Drive Speed',
			options: [
				{
					type: 'dropdown',
					label: 'Preset Nr.',
					id: PresetDriveNumberOption.id,
					choices: PresetDriveNumberOption.choices,
					minChoicesForSearch: 1,
					default: PresetDriveNumberOption.default,
				},
				{
					type: 'dropdown',
					label: 'speed setting',
					id: PresetDriveSpeedOption.id,
					choices: PresetDriveSpeedOption.choices,
					minChoicesForSearch: 1,
					default: PresetDriveSpeedOption.default,
				},
			],
			callback: async (event: CompanionActionEvent) => {
				void instance.sendCommand(PresetDriveSpeed, event.options)
			},
		},
		[FomakoActionId.CameraPowerState]: {
			name: 'Power Camera',
			options: [
				{
					type: 'dropdown',
					label: 'power on/standby',
					id: CameraPowerOption.id,
					choices: CameraPowerOption.choices,
					default: CameraPowerOption.default,
				},
			],
			callback: async (event: CompanionActionEvent) => {
				void instance.sendCommand(CameraPower, event.options)
			},
		},
		[FomakoActionId.OSD]: {
			name: 'OSD Open/Close',
			options: [
				{
					type: 'dropdown',
					label: 'Activate OSD menu',
					id: OnScreenDisplayOption.id,
					choices: [...OnScreenDisplayOption.choices, { id: 'toggle', label: 'toggle' }],
					default: 'toggle',
				},
			],
			callback: async ({ options }) => {
				let shouldToggle = false
				switch (options[OnScreenDisplayOption.id]) {
					case 'close':
						void instance.sendCommand(OnScreenDisplayClose)
						return
					case 'toggle':
						shouldToggle = true
						break
					case 'open': {
						const opts = await instance.sendInquiry(OnScreenDisplayInquiry)
						if (opts === null) return
						shouldToggle = opts[OnScreenDisplayOption.id] !== 'open'
					}
				}

				if (shouldToggle) {
					void instance.sendCommand(OnScreenDisplayToggle)
				}
			},
			learn: async (_event: CompanionActionEvent) => {
				const opts = await instance.sendInquiry(OnScreenDisplayInquiry)
				if (opts === null) return undefined
				return { ...opts }
			},
		},
		[FomakoActionId.OSDNavigate]: {
			name: 'Navigate OSD Camera menu',
			options: [
				{
					type: 'dropdown',
					label: 'Direction',
					id: OnScreenDisplayNavigateOption.id,
					choices: OnScreenDisplayNavigateOption.choices,
					default: 'down',
				},
			],
			callback: async (event: CompanionActionEvent) => {
				void instance.sendCommand(OnScreenDisplayNavigate, event.options)
			},
		},
		[FomakoActionId.OSDEnter]: {
			name: 'OSD Enter',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				void instance.sendCommand(OnScreenDisplayEnter)
			},
		},
		[FomakoActionId.OSDBack]: {
			name: 'OSD Back',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				void instance.sendCommand(OnScreenDisplayBack)
			},
		},
		[FomakoActionId.SelectWhiteBalance]: {
			name: 'White balance',
			options: [
				{
					type: 'dropdown',
					label: 'Mode',
					id: WhiteBalanceOption.id,
					choices: WhiteBalanceOption.choices,
					default: WhiteBalanceOption.default,
				},
			],
			callback: async (event: CompanionActionEvent) => {
				void instance.sendCommand(WhiteBalance, event.options)
			},
		},
		[FomakoActionId.WhiteBalanceOnePushTrigger]: {
			name: 'White balance one push trigger',
			options: [],
			callback: async (_event: CompanionActionEvent) => {
				void instance.sendCommand(WhiteBalanceOnePushTrigger)
			},
		},
		[FomakoActionId.SelectAutoWhiteBalanceSensitivity]: {
			name: 'Auto white balance sensitivity',
			options: [
				{
					type: 'dropdown',
					label: 'Sensitivity',
					id: AutoWhiteBalanceSensitivityOption.id,
					choices: AutoWhiteBalanceSensitivityOption.choices,
					default: AutoWhiteBalanceSensitivityOption.default,
				},
			],
			callback: async (event: CompanionActionEvent) => {
				void instance.sendCommand(AutoWhiteBalanceSensitivity, event.options)
			},
		},
		[FomakoActionId.AutoTracking]: {
			name: 'Auto Tracking',
			options: [
				{
					type: 'dropdown',
					label: 'Auto Tracking (PTZ Optics G3 model required)',
					id: AutoTrackingOption.id,
					choices: AutoTrackingOption.choices,
					default: AutoTrackingOption.default,
				},
			],
			callback: async (event: CompanionActionEvent) => {
				void instance.sendCommand(AutoTracking, event.options)
			},
		},
		[FomakoActionId.SendCustomCommand]: generateCustomCommandAction(instance),
	}

	return actionDefinitions
}
