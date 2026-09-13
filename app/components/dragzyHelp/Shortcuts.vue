```vue
<template>
	<div>
		<h6>Shortcuts</h6>

		<p>
			Use these keyboard shortcuts to work faster in Dragzy:
		</p>

		<table class="table table-sm table-bordered">
			<thead>
				<tr>
					<th>Key</th>
					<th>Action</th>
				</tr>
			</thead>

			<tbody>
				<tr>
					<td><kbd>P</kbd></td>
					<td>Presets</td>
				</tr>

				<tr>
					<td><kbd>R</kbd></td>
					<td>Resize</td>
				</tr>

				<tr>
					<td><kbd>I</kbd></td>
					<td>Import</td>
				</tr>

				<tr>
					<td><kbd>D</kbd></td>
					<td>Duplicate the active element</td>
				</tr>

				<tr>
					<td><kbd>U</kbd></td>
					<td>Update the active element</td>
				</tr>
			</tbody>
		</table>

		<div class="grey lighten-3 rounded p-3 mt-3">
			<strong>Active element:</strong>

			<p class="mb-0 mt-1">
				Some shortcuts operate on the currently selected element.
				Make sure an element is active before using these shortcuts
				so they can work as expected.
			</p>
		</div>

		<h6 class="mt-4">Imported Components</h6>

		<p class="mb-0">
			To see your imported components, make sure the current action is
			set to <strong>Import</strong>. Your imported components will be
			displayed when the Import action is active.
		</p>
	</div>
</template>
```
