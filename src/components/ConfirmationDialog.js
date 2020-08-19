import React from "react"
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button
} from "@material-ui/core"

export default function ConfirmationDialog({
	isOpen,
	onDeny,
	onConfirm,
	content,
	confirmActionName
}) {
	return (
		<Dialog open={isOpen} onClose={onDeny}>
			<DialogTitle id="alert-dialog-title">Are you sure?</DialogTitle>
			<DialogContent>{content}</DialogContent>
			<DialogActions>
				<Button onClick={onDeny} autoFocus color="primary">
					Cancel
				</Button>
				<Button onClick={onConfirm} variant="contained" color="primary">
					{confirmActionName}
				</Button>
			</DialogActions>
		</Dialog>
	)
}