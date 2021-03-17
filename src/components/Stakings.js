import React, { useContext } from "react"
import { Box, Typography } from "@material-ui/core"
import AppContext from "../AppContext"
import Bonds from "./Bonds"
import Deposits from "./Deposits"
import SectionHeader from "./SectionHeader"
import { useTranslation, Trans } from "react-i18next"
import { ExternalAnchor } from "./Anchor"
import { Alert } from "@material-ui/lab"

const Stakings = () => {
	const { t } = useTranslation()
	const {
		stats,
		setToUnbond,
		onUnbond,
		setToRestake,
		onClaimRewards,
		onRebond
	} = useContext(AppContext)

	return (
		<Box>
			<SectionHeader title={t("common.staked")} />
			<Box mt={2}>
				<Box color="text.main">
					<Typography variant="h5" gutterBottom>
						{t("common.bonds")}
					</Typography>
				</Box>
				<Box mt={2}>
					<Alert variant="filled" severity="info">
						<Box>{t("bonds.migrationAlertText1")}</Box>
						<Box>{t("bonds.migrationAlertText2")}</Box>
						<Box>{t("bonds.migrationAlertText3")}</Box>
						<Box>{t("bonds.migrationAlertText4")}</Box>
						<Box>{t("bonds.migrationAlertText5")}</Box>
						<Box>
							<Trans
								i18nKey="bonds.migrationAlertText6"
								components={{
									externalLink: (
										<ExternalAnchor
											// className={classes.getLink}
											color="secondary"
											id={`migration--alert-blogpost-link`}
											target="_blank"
											href={`https://www.adex.network/blog/staking-portal-upgrade/`}
										/>
									)
								}}
							/>
						</Box>
					</Alert>
				</Box>
				<Box mt={2} bgcolor="background.darkerPaper" boxShadow={25}>
					<Box p={3}>
						{Bonds({
							stats,
							onRequestUnbond: setToUnbond,
							onUnbond,
							onClaimRewards,
							onRestake: setToRestake,
							onRebond
						})}
					</Box>
				</Box>
			</Box>
			<Box mt={2}>
				<Box color="text.main">
					<Typography variant="h5" gutterBottom>
						{t("common.deposits")}
					</Typography>
				</Box>

				<Box mt={3} bgcolor="background.darkerPaper" boxShadow={25}>
					<Box p={3}>
						<Deposits />
					</Box>
				</Box>
			</Box>
		</Box>
	)
}

export default Stakings
