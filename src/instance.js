import { InstanceBase } from '@companion-module/base'
import { getActions } from './actions.js'
import { getConfigFields } from './config.js'
import { getPresets } from './presets.js'
import { VISCAPort } from './visca/port.js'

export class PtzOpticsInstance extends InstanceBase {
	#config
	#visca

	/**
	 * Send the given command to the camera, filling in parameters from the
	 * specified options.  The options must be compatible with the command's
	 * parameters.  Null may be passed if the command contains no parameters.
	 *
	 * @param {Command} command
	 *    The command to send.
	 * @param {?CompanionOptionValues} options
	 *    Compatible options to use to fill in any parameters in `command`; may
	 *    be null if `command` has no parameters.
	 * @returns {Promise<?CompanionOptionValues>}
	 *    A promise that resolves after the response to `command` (which may be
	 *    an error response) has been processed.  If `command`'s expected
	 *    response contains no parameters, or the response was an error, the
	 *    promise resolves null.  Otherwise it resolves an object whose
	 *    properties are choices corresponding to the parameters in the
	 *    response.
	 */
	sendCommand(command, options = null) {
		return this.#visca.sendCommand(command, options)
	}

	/**
	 * The speed to be passed in the pan/tilt speed parameters of Pan Tilt Drive
	 * VISCA commands.  Ranges between 0x01 (low speed) and 0x18 (high speed).
	 * However, as 0x15-0x18 are valid only for panning, tilt speed is capped at
	 * 0x14.
	 */
	#speed = 0x0c

	panTiltSpeed() {
		return {
			panSpeed: this.#speed,
			tiltSpeed: Math.min(this.#speed, 0x14),
		}
	}

	setPanTiltSpeed(speed) {
		if (0x01 <= speed && speed <= 0x18) {
			this.#speed = speed
		} else {
			this.log('debug', `speed ${speed} unexpectedly not in range [0x01, 0x18]`)
			this.#speed = 0x0c
		}
	}

	increasePanTiltSpeed() {
		if (this.#speed < 0x18) this.#speed++
	}

	decreasePanTiltSpeed() {
		if (this.#speed > 0x01) this.#speed--
	}

	constructor(internal) {
		super(internal)

		this.#visca = new VISCAPort(this)
	}

	updateActions() {
		this.setActionDefinitions(getActions(this))
	}

	updatePresets() {
		this.setPresetDefinitions(getPresets())
	}

	// Return config fields for web config of the module instance
	getConfigFields() {
		return getConfigFields()
	}

	// When the module gets deleted
	async destroy() {
		this.log('info', `destroying module: ${this.id}`)
		this.#visca.close()
	}

	async init(config) {
		this.#config = config

		// this is not called by Companion directly, so we need to call this to load the actions into Companion
		this.updateActions()

		// this is not called by Companion directly, so we need to call this to load the presets into Companion
		this.updatePresets()

		// start up the TCP socket and attmept to get connected to the PTZOptics device
		this.initTCP()
	}

	initTCP() {
		this.#visca.close()

		if (this.#config.host !== '') {
			this.#visca.open(this.#config.host, Number(this.#config.port))
		}
	}

	configUpdated(config) {
		// handle if the connection needs to be reset (ex. if the user changes the IP address, and we need to re-connect the socket to the new address)
		var resetConnection = false

		if (this.#config.host !== config.host) {
			resetConnection = true
		}

		this.#config = config

		if (resetConnection || this.#visca.closed) {
			this.initTCP()
		}
	}
}
