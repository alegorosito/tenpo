output "psql_public_ip" {
  description = "Public PSQL IP address"
  value = azurerm_public_ip.psql_public_ip.ip_address
}

output "psql_vm_name" {
  description = "Public PSQL VM Name"
  value = azurerm_linux_virtual_machine.tenpo_psql.name
}

output "api_public_ip" {
  description = "Public Api IP address"
  value = azurerm_public_ip.api_public_ip.ip_address
}

output "api_vm_name" {
  description = "Public API VM Name"
  value = azurerm_linux_virtual_machine.tenpo_api.name
}
