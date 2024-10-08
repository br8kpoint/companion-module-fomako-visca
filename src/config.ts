import { Regex, type SomeCompanionConfigField } from '@companion-module/base'

export interface FomakoConfig {
	host: string
	port: string
	debugLogging: boolean
}

/**
 * Test whether a config is missing the 'debugLogging' option that was added in
 * 3.0.0.
 */
export function configIsMissingDebugLogging(config: FomakoConfig | null): config is FomakoConfig {
	return config !== null && !('debugLogging' in config)
}

/**
 * Add the 'debugLogging' option (defaulting to false) to a pre-3.0.0 config
 * that's missing it.
 */
export function addDebugLoggingOptionToConfig(config: FomakoConfig): void {
	config.debugLogging = false
}

export function getConfigFields(): SomeCompanionConfigField[] {
	return [
		{
			type: 'static-text',
			id: 'info',
			width: 12,
			label: 'Information',
			value: 'This module controls PTZ cameras with VISCA over IP protocol',
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'Camera IP',
			width: 6,
			default: '',
			regex: Regex.IP,
			required: true,
		},
		{
			type: 'textinput',
			id: 'port',
			label: 'VISCA TCP port',
			width: 6,
			default: '5678',
			regex: Regex.PORT,
			required: true,
		},
		{
			type: 'checkbox',
			id: 'debugLogging',
			label: 'Log extra info during connection operations, for debugging purposes',
			default: false,
			width: 6,
		},
	]
}
