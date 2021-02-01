# API Public IP
resource "azurerm_public_ip" "api_public_ip" {
  name                = "apiIP"
  resource_group_name = azurerm_resource_group.tenpo.name
  location            = azurerm_resource_group.tenpo.location
  allocation_method   = "Static"

  tags = {
    environment = "Testing"
  }
}

resource "azurerm_network_interface" "api_nic" {
  name                = "apinic"
  location            = azurerm_resource_group.tenpo.location
  resource_group_name = azurerm_resource_group.tenpo.name

  ip_configuration {
    name                          = "ip2"
    subnet_id                     = azurerm_subnet.tenpo_subnet.id
    private_ip_address_allocation = "Static"
    private_ip_address            = "10.0.10.10"
    public_ip_address_id          = azurerm_public_ip.api_public_ip.id
  }
}

# API VM
resource "azurerm_linux_virtual_machine" "tenpo_api" {
  name                = "tenpoapi"
  resource_group_name = azurerm_resource_group.tenpo.name
  location            = azurerm_resource_group.tenpo.location
  size                = "Standard_B1s"
  admin_username      = "admintenpo"
  network_interface_ids = [
    azurerm_network_interface.api_nic.id,
  ]

  admin_ssh_key {
    username   = "admintenpo"
    public_key = file("~/.ssh/id_rsa.pub")
  }

  os_disk {
    caching              = "ReadWrite"
    storage_account_type = "Standard_LRS"
  }

  source_image_reference {
    publisher = "Debian"
    offer     = "debian-10"
    sku       = "10"
    version   = "latest"
  }
}
