---
title: "Configuración de red empresarial con pfSense"
pubDate: "Tue Aug 19 2025"
image: "https://cz9dev.github.io/assets/img/thumb_red_empresarial.png"
username: "cz9dev"
categories: ["tutorials"]
description: "Cómo configurar una red empresarial dividiendo la red en WAN, LAN y DMZ con pfSense, Windows Server 2019, un switch capa 3 para la segmentación la red utilizando VLAN"
canonicalUrl: "https://cz9dev.github.io/22-07-2025-configuraci%C3%B3n-de-red-empresarial-con-pfSense/"
---

Configurar una red empresarial con pfSense (v2.7.2), Windows Server 2019 (como DC), un switch capa 3 y segmentación en WAN, LAN y DMZ requiere una planificación cuidadosa. A continuación, te detallo la configuración paso a paso:

# 1. Diagrama de Red Propuesto

```text
[INTERNET] (WAN)
   |
[pfSense] (Firewall)
   |--- (LAN) → [Switch Capa 3] → [PCs, Dominio (Windows Server 2019)]
   |--- (DMZ) → [Servidores Públicos (Web, Correo, etc.)]
```

# 2. Configuración de pfSense
## Interfaces de Red

| Interfaz | Nombre | IPv4 | VLAN | Descripción |
|---|---|---|---|---|
| WAN | igb0 | DHCP/PPPoE/Static (ISP) | - | Conexión a Internet |
| LAN | igb1 | 192.168.1.1/24 | - | Red interna (usuarios, dominio) |
| DMZ | igb2 | 10.0.0.1/24 | - | Zona desmilitarizada (servidores públicos) |

## Configuración en pfSense:

1. WAN (igb0):
    * Configurar según proveedor (DHCP/PPPoE/IP estática).
    * Habilitar Block Private Networks y Block Bogon Networks.

2. LAN (igb1):
    * IP: ```192.168.1.1/24```
    * DHCP Server: Habilitar (rango ```192.168.1.100-192.168.1.200```).
    * DNS: Apuntar al Windows Server 2019 (```192.168.1.2```).

3. DMZ (igb2):
    * IP: ```10.0.0.1/24```
    * No DHCP (asignación manual o reservas).
    * Reglas de firewall: Permitir solo tráfico necesario desde WAN (ej: HTTP/HTTPS).

# 3. Configuración del Switch Capa 3
## VLANs y Routing

| VLAN | Nombre | Subred | Gateway | Uso |
|---|---|---|---|---|
| 10 | LAN | ```192.168.1.0/24``` | ```192.168.1.1``` (pfSense) | Usuarios, Dominio |
| 20 | DMZ | ```10.0.0.0/24``` | ```10.0.0.1``` (pfSense) | Servidores Públicos |
| 30 | MGMT | ```172.16.0.0/24``` | ```172.16.0.1``` | Administración del Switch |

## Comandos Ejemplo (Cisco):

```bash

vlan 10
 name LAN
vlan 20
 name DMZ
vlan 30
 name MGMT

interface vlan10
 ip address 192.168.1.254 255.255.255.0
!
interface vlan20
 ip address 10.0.0.254 255.255.255.0
!
interface vlan30
 ip address 172.16.0.254 255.255.255.0

ip route 0.0.0.0 0.0.0.0 192.168.1.1  # Ruta por defecto hacia pfSense (LAN)
```

# 4. Configuración del Dominio (Windows Server 2019)

## Requisitos:
* IP Estática: ```192.168.1.2/24```
* Gateway: ```192.168.1.1``` (pfSense LAN)
* DNS: Loopback (```127.0.0.1```) o otro DC si hay redundancia.

## Pasos:

1. Instalar Active Directory Domain Services (AD DS).
2. Promocionar a Controlador de Dominio (ej: ```empresa.local```).
3. Configurar DHCP (opcional, si no se usa pfSense para DHCP).
4. Asegurar que las PCs apunten al DNS del servidor (```192.168.1.2```).

# 5. Configuración de las PCs
* IP: DHCP (rango 192.168.1.100-200) o estática.
* Gateway: 192.168.1.1 (pfSense LAN).
* DNS: 192.168.1.2 (Windows Server 2019).

# 6. Reglas de Firewall en pfSense
## WAN → DMZ
* Permitir **HTTP (80)** y **HTTPS (443)** hacia servidor web (```10.0.0.10```).
* Permitir **SMTP (25)** si hay servidor de correo.

## LAN → WAN
* Permitir todo (NAT Outbound).

## DMZ → LAN
* Denegar todo (la DMZ no debe acceder a la LAN).

# 7. Recomendaciones de Seguridad
* ### pfSense:
    * Habilitar **IDS/IPS (Suricata/Snort).**
    * Configurar **OpenVPN/IPSec** para acceso remoto seguro.

* ### Windows Server:
    * Implementar **GPOs** para políticas de seguridad.
    * Actualizaciones automáticas.

* ### Switch:
    * Deshabilitar puertos no usados.
    * Configurar **802.1X** para autenticación de dispositivos.

| Dispositivo | Interfaz | IP |
|---|---|---|
| pfSense | WAN | ISP |
| pfSense | LAN | ```192.168.1.1``` |
| pfSense | DMZ | ```10.0.0.1``` |
| Windows Server | LAN | ```192.168.1.2``` |
| Switch (VLAN 10) | LAN | ```192.168.1.254``` |
| Switch (VLAN 20) | DMZ | ```10.0.0.254``` |

Si te vieras en la necesidad de tener el correo en la LAN debes entonces crear reglas en el firewall en pfSense para el correo

# Alternativa: Servidor de Correo en la LAN (Recomendado para Seguridad)

Si el servidor de correo solo es usado internamente, evita ponerlo en la DMZ y colócalo en la LAN (con reglas NAT en pfSense para redirigir tráfico entrante desde Internet). Esto reduce la exposición a ataques.
