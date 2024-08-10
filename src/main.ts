import { runEntrypoint } from '@companion-module/base'
import { FomakoInstance } from './instance.js'
import { UpgradeScripts } from './upgrades.js'

runEntrypoint(FomakoInstance, UpgradeScripts)
