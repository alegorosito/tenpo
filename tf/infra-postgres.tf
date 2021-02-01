provider "azurerm" {
  features {}
}

resource "azurerm_resource_group" "tenpo" {
  name     = "tenporg"
  location = "West US 2"
}

resource "azurerm_virtual_network" "tenpo_net" {
  name                = "tenponetwork"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.tenpo.location
  resource_group_name = azurerm_resource_group.tenpo.name
}

# PSQL Public IPf
resource "azurerm_public_ip" "psql_public_ip" {
  name                = "psqlIP"
  resource_group_name = azurerm_resource_group.tenpo.name
  location            = azurerm_resource_group.tenpo.location
  allocation_method   = "Static"

  tags = {
    environment = "Testing"
  }
}

resource "azurerm_subnet" "tenpo_subnet" {
  name                 = "acctsub"
  resource_group_name  = azurerm_resource_group.tenpo.name
  virtual_network_name = azurerm_virtual_network.tenpo_net.name
  address_prefixes     = ["10.0.10.0/24"]
}


resource "azurerm_network_interface" "psql_nic" {
  name                = "psqlnic"
  location            = azurerm_resource_group.tenpo.location
  resource_group_name = azurerm_resource_group.tenpo.name

  ip_configuration {
    name                          = "ip1"
    subnet_id                     = azurerm_subnet.tenpo_subnet.id
    private_ip_address_allocation = "Static"
    private_ip_address            = "10.0.10.100"
    public_ip_address_id          = azurerm_public_ip.psql_public_ip.id
  }
}

# PSQL VM
resource "azurerm_linux_virtual_machine" "tenpo_psql" {
  name                = "tenpopsql"
  resource_group_name = azurerm_resource_group.tenpo.name
  location            = azurerm_resource_group.tenpo.location
  size                = "Standard_B1s"
  admin_username      = "admintenpo"
  network_interface_ids = [
    azurerm_network_interface.psql_nic.id,
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

