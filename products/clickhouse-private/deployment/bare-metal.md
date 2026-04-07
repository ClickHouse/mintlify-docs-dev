---
title: "ClickHouse Private on Bare Metal"
slug: "docs/products/clickhouse-private/bare-metal"
sidebarTitle: "Bare-metal"
---

Below is an example of the installation process on bare-metal nodes in AWS

### Terraform 

#### Download and install Terraform

```
dnf install -y unzip git
```
```
curl -O  https://releases.hashicorp.com/terraform/1.13.2/terraform_1.13.2_linux_amd64.zip
```
```
unzip terraform_1.13.2_linux_amd64.zip
```
```
sudo cp terraform /usr/local/bin
```
```
terraform version
```
```
Terraform v1.13.2
on linux_amd64
```

#### Download and unzip the examples scripts

`<<EXAMPLES_LINK>>`

```
unzip example-scripts.zip
cd ./bare-metal

```

#### Acquire AWS IAM credentials and create a credentials file

Visit the AWS IAM console and create a access key and secret key
and save these values.

__NOTE__
Replace `<Your AWS ACCESS KEY ID>` and `<Your AWS SECRET ACCESS KEY>` with the
values acquired from the AWS IAM console.

```
cat > aws-creds.sh <<EOF
export AWS_ACCESS_KEY_ID=<Your AWS ACCESS KEY ID>
export AWS_SECRET_ACCESS_KEY=<Your AWS SECRET ACCESS KEY>
export AWS_REGION=us-east-2
EOF
```

#### Load your AWS IAM credentials
```
source ./aws-creds.sh
```

__NOTE - Add `-migrate-state` if moving state from local to s3__

#### Initialize the rke2 Terraform module
```
terraform -chdir=modules/rke2 init \ 
-backend-config="encrypt=true" \
-backend-config="region=us-east-2" \
-backend-config="bucket=chb-tfstate-359774249275" \
-backend-config="use_lockfile=true" \
-backend-config="key=chb/rke2/terraform.tfstate"
```

#### Issue a Terraform apply command to bring the stack up

From within the `terraform` directory located in the git repository
```
terraform -chdir=modules/rke2 apply \
-var-file=../../vars/common.tfvars \
-var-file=../../vars/instances.tfvars \
-var-file=../../vars/rke2.tfvars
```

### Ansible

#### Run Ansible to provision RKE2 software

##### Go to Ansible directory

```
cd ~/bare-metal/ansible
```

##### Install Ansible Galaxy role [lablabs.rke2](https://galaxy.ansible.com/ui/standalone/roles/lablabs/rke2/)

```
ansible-galaxy role install lablabs.rke2
```

##### Install Ansible Galaxy collection [kubernetes-core](https://galaxy.ansible.com/ui/repo/published/kubernetes/core/)

```
ansible-galaxy collection install kubernetes.core
```

##### Verify that the nodes are ready

```
ansible all -i inventory.yml -a 'cloud-init status'
```

##### Configure NVMEs

```
ansible-playbook -i inventory.yml disks_nvme.yml
```

##### Run RKE2 playbook *../ansible/rke2_playbook*

```
ansible-playbook -i inventory.yml rke2_playbook.yml
```

Output:
```bash
  PLAY [Deploy RKE2] *************************************************************

  TASK [Manage NetworkManager exclusions] ****************************************
  changed: [chb-rke2s102]
  changed: [chb-rke2s201]
  changed: [chb-rke2s101]
  changed: [chb-rke2s202]
  changed: [chb-rke2s301]
  changed: [chb-rke2s302]
  
  TASK [Reload NetworkManager] ***************************************************
  changed: [chb-rke2s301]
  changed: [chb-rke2s101]
  changed: [chb-rke2s201]
  changed: [chb-rke2s202]
  changed: [chb-rke2s302]
  changed: [chb-rke2s102]
  
  TASK [lablabs.rke2 : Validating arguments against arg spec 'main' - This is the main entrypoint for the lablabs.rke2 role.] ***
  ok: [chb-rke2s101]
  ok: [chb-rke2s201]
  ok: [chb-rke2s301]
  ok: [chb-rke2s302]
  ok: [chb-rke2s102]
  ok: [chb-rke2s202]
  
  TASK [lablabs.rke2 : Install Keepalived when HA mode is enabled] ***************
  skipping: [chb-rke2s101]
  skipping: [chb-rke2s201]
  skipping: [chb-rke2s202]
  skipping: [chb-rke2s301]
  skipping: [chb-rke2s102]
  skipping: [chb-rke2s302]
  
  TASK [lablabs.rke2 : Download and install RKE2 v1.33.5+rke2r1] *****************
  included: /home/rocky/.ansible/roles/lablabs.rke2/tasks/rke2.yml for chb-rke2s101, chb-rke2s201, chb-rke2s301, chb-rke2s102, chb-rke2s202, chb-rke2s302
  
  TASK [lablabs.rke2 : Download RKE2 installation script] ************************
  changed: [chb-rke2s201]
  changed: [chb-rke2s102]
  changed: [chb-rke2s202]
  changed: [chb-rke2s301]
  changed: [chb-rke2s101]
  changed: [chb-rke2s302]
  
  TASK [lablabs.rke2 : Copy local RKE2 installation script] **********************
  skipping: [chb-rke2s101]
  skipping: [chb-rke2s201]
  skipping: [chb-rke2s301]
  skipping: [chb-rke2s102]
  skipping: [chb-rke2s202]
  skipping: [chb-rke2s302]
  
  TASK [lablabs.rke2 : Create RKE2 artifacts folder] *****************************
  skipping: [chb-rke2s101]
  skipping: [chb-rke2s201]
  skipping: [chb-rke2s301]
  skipping: [chb-rke2s102]
  skipping: [chb-rke2s202]
  skipping: [chb-rke2s302]
  
  TASK [lablabs.rke2 : Download sha256 checksum file ( airgap mode )] ************
  skipping: [chb-rke2s101]
  skipping: [chb-rke2s201]
  skipping: [chb-rke2s301]
  skipping: [chb-rke2s102]
  skipping: [chb-rke2s202]
  skipping: [chb-rke2s302]
  
  TASK [lablabs.rke2 : Download RKE2 artifacts and compare with checksums ( airgap mode )] ***
  skipping: [chb-rke2s101] => (item=rke2.linux-amd64.tar.gz) 
  skipping: [chb-rke2s101] => (item=rke2-images.linux-amd64.tar.zst) 
  skipping: [chb-rke2s101]
  skipping: [chb-rke2s201] => (item=rke2.linux-amd64.tar.gz) 
  skipping: [chb-rke2s201] => (item=rke2-images.linux-amd64.tar.zst) 
  skipping: [chb-rke2s201]
  skipping: [chb-rke2s301] => (item=rke2.linux-amd64.tar.gz) 
  skipping: [chb-rke2s301] => (item=rke2-images.linux-amd64.tar.zst) 
  skipping: [chb-rke2s301]
  skipping: [chb-rke2s102] => (item=rke2.linux-amd64.tar.gz) 
  skipping: [chb-rke2s102] => (item=rke2-images.linux-amd64.tar.zst) 
  skipping: [chb-rke2s102]
  skipping: [chb-rke2s202] => (item=rke2.linux-amd64.tar.gz) 
  skipping: [chb-rke2s202] => (item=rke2-images.linux-amd64.tar.zst) 
  skipping: [chb-rke2s202]
  skipping: [chb-rke2s302] => (item=rke2.linux-amd64.tar.gz) 
  skipping: [chb-rke2s302] => (item=rke2-images.linux-amd64.tar.zst) 
  skipping: [chb-rke2s302]
  
  TASK [lablabs.rke2 : Download RKE2 install script ( airgap mode )] *************
  skipping: [chb-rke2s101]
  skipping: [chb-rke2s201]
  skipping: [chb-rke2s301]
  skipping: [chb-rke2s102]
  skipping: [chb-rke2s202]
  skipping: [chb-rke2s302]
  
  TASK [lablabs.rke2 : Copy local RKE2 artifacts] ********************************
  skipping: [chb-rke2s101] => (item=sha256sum-amd64.txt) 
  skipping: [chb-rke2s101] => (item=rke2.linux-amd64.tar.gz) 
  skipping: [chb-rke2s101] => (item=rke2-images.linux-amd64.tar.zst) 
  skipping: [chb-rke2s101]
  skipping: [chb-rke2s201] => (item=sha256sum-amd64.txt) 
  skipping: [chb-rke2s201] => (item=rke2.linux-amd64.tar.gz) 
  skipping: [chb-rke2s201] => (item=rke2-images.linux-amd64.tar.zst) 
  skipping: [chb-rke2s201]
  skipping: [chb-rke2s301] => (item=sha256sum-amd64.txt) 
  skipping: [chb-rke2s301] => (item=rke2.linux-amd64.tar.gz) 
  skipping: [chb-rke2s301] => (item=rke2-images.linux-amd64.tar.zst) 
  skipping: [chb-rke2s102] => (item=sha256sum-amd64.txt) 
  skipping: [chb-rke2s102] => (item=rke2.linux-amd64.tar.gz) 
  skipping: [chb-rke2s102] => (item=rke2-images.linux-amd64.tar.zst) 
  skipping: [chb-rke2s301]
  skipping: [chb-rke2s102]
  skipping: [chb-rke2s202] => (item=sha256sum-amd64.txt) 
  skipping: [chb-rke2s202] => (item=rke2.linux-amd64.tar.gz) 
  skipping: [chb-rke2s202] => (item=rke2-images.linux-amd64.tar.zst) 
  skipping: [chb-rke2s202]
  skipping: [chb-rke2s302] => (item=sha256sum-amd64.txt) 
  skipping: [chb-rke2s302] => (item=rke2.linux-amd64.tar.gz) 
  skipping: [chb-rke2s302] => (item=rke2-images.linux-amd64.tar.zst) 
  skipping: [chb-rke2s302]
  
  TASK [lablabs.rke2 : Create additional images tarballs folder] *****************
  skipping: [chb-rke2s101]
  skipping: [chb-rke2s201]
  skipping: [chb-rke2s301]
  skipping: [chb-rke2s102]
  skipping: [chb-rke2s202]
  skipping: [chb-rke2s302]
  
  TASK [lablabs.rke2 : Copy additional tarball images RKE2 components] ***********
  skipping: [chb-rke2s101]
  skipping: [chb-rke2s201]
  skipping: [chb-rke2s301]
  skipping: [chb-rke2s102]
  skipping: [chb-rke2s202]
  skipping: [chb-rke2s302]
  
  TASK [lablabs.rke2 : Register artifacts] ***************************************
  skipping: [chb-rke2s101] => (item=sha256sum-amd64.txt) 
  skipping: [chb-rke2s101] => (item=rke2.linux-amd64.tar.gz) 
  skipping: [chb-rke2s101] => (item=rke2-images.linux-amd64.tar.zst) 
  skipping: [chb-rke2s101]
  skipping: [chb-rke2s201] => (item=sha256sum-amd64.txt) 
  skipping: [chb-rke2s201] => (item=rke2.linux-amd64.tar.gz) 
  skipping: [chb-rke2s201] => (item=rke2-images.linux-amd64.tar.zst) 
  skipping: [chb-rke2s201]
  skipping: [chb-rke2s301] => (item=sha256sum-amd64.txt) 
  skipping: [chb-rke2s301] => (item=rke2.linux-amd64.tar.gz) 
  skipping: [chb-rke2s301] => (item=rke2-images.linux-amd64.tar.zst) 
  skipping: [chb-rke2s102] => (item=sha256sum-amd64.txt) 
  skipping: [chb-rke2s102] => (item=rke2.linux-amd64.tar.gz) 
  skipping: [chb-rke2s102] => (item=rke2-images.linux-amd64.tar.zst) 
  skipping: [chb-rke2s301]
  skipping: [chb-rke2s102]
  skipping: [chb-rke2s202] => (item=sha256sum-amd64.txt) 
  skipping: [chb-rke2s202] => (item=rke2.linux-amd64.tar.gz) 
  skipping: [chb-rke2s202] => (item=rke2-images.linux-amd64.tar.zst) 
  skipping: [chb-rke2s202]
  skipping: [chb-rke2s302] => (item=sha256sum-amd64.txt) 
  skipping: [chb-rke2s302] => (item=rke2.linux-amd64.tar.gz) 
  skipping: [chb-rke2s302] => (item=rke2-images.linux-amd64.tar.zst) 
  skipping: [chb-rke2s302]
  
  TASK [lablabs.rke2 : Register install script] **********************************
  skipping: [chb-rke2s101]
  skipping: [chb-rke2s201]
  skipping: [chb-rke2s301]
  skipping: [chb-rke2s102]
  skipping: [chb-rke2s202]
  skipping: [chb-rke2s302]
  
  TASK [lablabs.rke2 : Register artifact facts] **********************************
  skipping: [chb-rke2s101]
  skipping: [chb-rke2s201]
  skipping: [chb-rke2s301]
  skipping: [chb-rke2s102]
  skipping: [chb-rke2s202]
  skipping: [chb-rke2s302]
  
  TASK [lablabs.rke2 : Make the artifacts read-only] *****************************
  skipping: [chb-rke2s101] => (item=sha256sum-amd64.txt) 
  skipping: [chb-rke2s101] => (item=rke2.linux-amd64.tar.gz) 
  skipping: [chb-rke2s101] => (item=rke2-images.linux-amd64.tar.zst) 
  skipping: [chb-rke2s101]
  skipping: [chb-rke2s201] => (item=sha256sum-amd64.txt) 
  skipping: [chb-rke2s201] => (item=rke2.linux-amd64.tar.gz) 
  skipping: [chb-rke2s201] => (item=rke2-images.linux-amd64.tar.zst) 
  skipping: [chb-rke2s201]
  skipping: [chb-rke2s301] => (item=sha256sum-amd64.txt) 
  skipping: [chb-rke2s301] => (item=rke2.linux-amd64.tar.gz) 
  skipping: [chb-rke2s301] => (item=rke2-images.linux-amd64.tar.zst) 
  skipping: [chb-rke2s102] => (item=sha256sum-amd64.txt) 
  skipping: [chb-rke2s102] => (item=rke2.linux-amd64.tar.gz) 
  skipping: [chb-rke2s102] => (item=rke2-images.linux-amd64.tar.zst) 
  skipping: [chb-rke2s301]
  skipping: [chb-rke2s102]
  skipping: [chb-rke2s202] => (item=sha256sum-amd64.txt) 
  skipping: [chb-rke2s202] => (item=rke2.linux-amd64.tar.gz) 
  skipping: [chb-rke2s202] => (item=rke2-images.linux-amd64.tar.zst) 
  skipping: [chb-rke2s202]
  skipping: [chb-rke2s302] => (item=sha256sum-amd64.txt) 
  skipping: [chb-rke2s302] => (item=rke2.linux-amd64.tar.gz) 
  skipping: [chb-rke2s302] => (item=rke2-images.linux-amd64.tar.zst) 
  skipping: [chb-rke2s302]
  
  TASK [lablabs.rke2 : Make the install script executable.] **********************
  skipping: [chb-rke2s101]
  skipping: [chb-rke2s201]
  skipping: [chb-rke2s301]
  skipping: [chb-rke2s102]
  skipping: [chb-rke2s202]
  skipping: [chb-rke2s302]
  
  TASK [lablabs.rke2 : Install script must be executable] ************************
  skipping: [chb-rke2s101]
  skipping: [chb-rke2s201]
  skipping: [chb-rke2s301]
  skipping: [chb-rke2s102]
  skipping: [chb-rke2s202]
  skipping: [chb-rke2s302]
  
  TASK [lablabs.rke2 : Populate service facts] ***********************************
  ok: [chb-rke2s201]
  ok: [chb-rke2s101]
  ok: [chb-rke2s102]
  ok: [chb-rke2s301]
  ok: [chb-rke2s302]
  ok: [chb-rke2s202]
  
  TASK [lablabs.rke2 : Get stats of the FS object] *******************************
  ok: [chb-rke2s101]
  ok: [chb-rke2s201]
  ok: [chb-rke2s301]
  ok: [chb-rke2s102]
  ok: [chb-rke2s202]
  ok: [chb-rke2s302]
  
  TASK [lablabs.rke2 : Check if separate partition] ******************************
  ok: [chb-rke2s202]
  ok: [chb-rke2s201]
  ok: [chb-rke2s102]
  ok: [chb-rke2s302]
  ok: [chb-rke2s101]
  ok: [chb-rke2s301]
  
  TASK [lablabs.rke2 : Set RKE2 bin path] ****************************************
  ok: [chb-rke2s101]
  ok: [chb-rke2s201]
  ok: [chb-rke2s301]
  ok: [chb-rke2s102]
  ok: [chb-rke2s202]
  ok: [chb-rke2s302]
  
  TASK [lablabs.rke2 : Check RKE2 version] ***************************************
  ok: [chb-rke2s101]
  ok: [chb-rke2s201]
  ok: [chb-rke2s301]
  ok: [chb-rke2s102]
  ok: [chb-rke2s202]
  ok: [chb-rke2s302]
  
  TASK [lablabs.rke2 : Set RKE2 versions] ****************************************
  ok: [chb-rke2s101]
  ok: [chb-rke2s201]
  ok: [chb-rke2s301]
  ok: [chb-rke2s102]
  ok: [chb-rke2s202]
  ok: [chb-rke2s302]
  
  TASK [lablabs.rke2 : Prevent accidental RKE2 downgrade] ************************
  skipping: [chb-rke2s101]
  skipping: [chb-rke2s201]
  skipping: [chb-rke2s301]
  skipping: [chb-rke2s102]
  skipping: [chb-rke2s202]
  skipping: [chb-rke2s302]
  
  TASK [lablabs.rke2 : Run RKE2 install script with airgap variables] ************
  skipping: [chb-rke2s101]
  skipping: [chb-rke2s201]
  skipping: [chb-rke2s301]
  skipping: [chb-rke2s102]
  skipping: [chb-rke2s202]
  skipping: [chb-rke2s302]
  
  TASK [lablabs.rke2 : Run RKE2 install script without airgap variables] *********
  ok: [chb-rke2s102]
  ok: [chb-rke2s301]
  ok: [chb-rke2s101]
  ok: [chb-rke2s302]
  ok: [chb-rke2s201]
  ok: [chb-rke2s202]
  
  TASK [lablabs.rke2 : Copy Custom Manifests] ************************************
  skipping: [chb-rke2s101]
  skipping: [chb-rke2s201]
  skipping: [chb-rke2s301]
  skipping: [chb-rke2s102]
  skipping: [chb-rke2s202]
  skipping: [chb-rke2s302]
  
  TASK [lablabs.rke2 : Copy Static Pods] *****************************************
  skipping: [chb-rke2s101]
  skipping: [chb-rke2s201]
  skipping: [chb-rke2s301]
  skipping: [chb-rke2s102]
  skipping: [chb-rke2s202]
  skipping: [chb-rke2s302]
  
  TASK [lablabs.rke2 : Copy RKE2 environment file] *******************************
  skipping: [chb-rke2s101]
  skipping: [chb-rke2s201]
  skipping: [chb-rke2s301]
  skipping: [chb-rke2s102]
  skipping: [chb-rke2s202]
  skipping: [chb-rke2s302]
  
  TASK [lablabs.rke2 : CIS Hardening] ********************************************
  skipping: [chb-rke2s101]
  skipping: [chb-rke2s201]
  skipping: [chb-rke2s301]
  skipping: [chb-rke2s102]
  skipping: [chb-rke2s202]
  skipping: [chb-rke2s302]
  
  TASK [lablabs.rke2 : Find Active Server] ***************************************
  included: /home/rocky/.ansible/roles/lablabs.rke2/tasks/find_active_server.yml for chb-rke2s101, chb-rke2s201, chb-rke2s301, chb-rke2s102, chb-rke2s202, chb-rke2s302
  
  TASK [lablabs.rke2 : Populate services facts] **********************************
  ok: [chb-rke2s101]
  ok: [chb-rke2s201]
  ok: [chb-rke2s102]
  ok: [chb-rke2s202]
  ok: [chb-rke2s302]
  ok: [chb-rke2s301]
  
  TASK [lablabs.rke2 : Set the Active Server variable] ***************************
  skipping: [chb-rke2s101] => (item=chb-rke2s101) 
  skipping: [chb-rke2s101] => (item=chb-rke2s201) 
  skipping: [chb-rke2s101] => (item=chb-rke2s301) 
  skipping: [chb-rke2s201] => (item=chb-rke2s101) 
  skipping: [chb-rke2s101] => (item=chb-rke2s102) 
  skipping: [chb-rke2s201] => (item=chb-rke2s201) 
  skipping: [chb-rke2s301] => (item=chb-rke2s101) 
  skipping: [chb-rke2s101] => (item=chb-rke2s202) 
  skipping: [chb-rke2s201] => (item=chb-rke2s301) 
  skipping: [chb-rke2s301] => (item=chb-rke2s201) 
  skipping: [chb-rke2s102] => (item=chb-rke2s101) 
  skipping: [chb-rke2s102] => (item=chb-rke2s201) 
  skipping: [chb-rke2s101] => (item=chb-rke2s302) 
  skipping: [chb-rke2s101]
  skipping: [chb-rke2s201] => (item=chb-rke2s102) 
  skipping: [chb-rke2s301] => (item=chb-rke2s301) 
  skipping: [chb-rke2s202] => (item=chb-rke2s101) 
  skipping: [chb-rke2s102] => (item=chb-rke2s301) 
  skipping: [chb-rke2s301] => (item=chb-rke2s102) 
  skipping: [chb-rke2s102] => (item=chb-rke2s102) 
  skipping: [chb-rke2s202] => (item=chb-rke2s201) 
  skipping: [chb-rke2s201] => (item=chb-rke2s202) 
  skipping: [chb-rke2s302] => (item=chb-rke2s101) 
  skipping: [chb-rke2s102] => (item=chb-rke2s202) 
  skipping: [chb-rke2s301] => (item=chb-rke2s202) 
  skipping: [chb-rke2s102] => (item=chb-rke2s302) 
  skipping: [chb-rke2s102]
  skipping: [chb-rke2s301] => (item=chb-rke2s302) 
  skipping: [chb-rke2s301]
  skipping: [chb-rke2s302] => (item=chb-rke2s201) 
  skipping: [chb-rke2s202] => (item=chb-rke2s301) 
  skipping: [chb-rke2s201] => (item=chb-rke2s302) 
  skipping: [chb-rke2s201]
  skipping: [chb-rke2s302] => (item=chb-rke2s301) 
  skipping: [chb-rke2s202] => (item=chb-rke2s102) 
  skipping: [chb-rke2s302] => (item=chb-rke2s102) 
  skipping: [chb-rke2s302] => (item=chb-rke2s202) 
  skipping: [chb-rke2s202] => (item=chb-rke2s202) 
  skipping: [chb-rke2s302] => (item=chb-rke2s302) 
  skipping: [chb-rke2s302]
  skipping: [chb-rke2s202] => (item=chb-rke2s302) 
  skipping: [chb-rke2s202]
  
  TASK [lablabs.rke2 : Enable IPVS kernel module] ********************************
  skipping: [chb-rke2s101]
  skipping: [chb-rke2s201]
  skipping: [chb-rke2s301]
  skipping: [chb-rke2s102]
  skipping: [chb-rke2s202]
  skipping: [chb-rke2s302]
  
  TASK [lablabs.rke2 : Copy kube-vip manifests to the masternode] ****************
  skipping: [chb-rke2s101]
  skipping: [chb-rke2s201]
  skipping: [chb-rke2s301]
  skipping: [chb-rke2s102]
  skipping: [chb-rke2s202]
  skipping: [chb-rke2s302]
  
  TASK [lablabs.rke2 : Copy ingress-nginx manifests to the masternode] ***********
  skipping: [chb-rke2s201]
  skipping: [chb-rke2s301]
  skipping: [chb-rke2s102]
  skipping: [chb-rke2s202]
  skipping: [chb-rke2s302]
  included: /home/rocky/.ansible/roles/lablabs.rke2/tasks/ingress-nginx.yml for chb-rke2s101
  
  TASK [lablabs.rke2 : Create the RKE2 manifests directory] **********************
  changed: [chb-rke2s101]
  
  TASK [lablabs.rke2 : Copy ingress-nginx files to first server] *****************
  changed: [chb-rke2s101]
  
  TASK [lablabs.rke2 : Prepare very first server node in the cluster] ************
  skipping: [chb-rke2s201]
  skipping: [chb-rke2s301]
  skipping: [chb-rke2s102]
  skipping: [chb-rke2s202]
  skipping: [chb-rke2s302]
  included: /home/rocky/.ansible/roles/lablabs.rke2/tasks/first_server.yml for chb-rke2s101
  
  TASK [lablabs.rke2 : Create the RKE2 config dir] *******************************
  changed: [chb-rke2s101]
  
  TASK [lablabs.rke2 : Set server taints] ****************************************
  ok: [chb-rke2s101]
  
  TASK [lablabs.rke2 : Copy rke2 config] *****************************************
  changed: [chb-rke2s101]
  
  TASK [lablabs.rke2 : Copy kubelet config] **************************************
  skipping: [chb-rke2s101]
  
  TASK [lablabs.rke2 : Copy Containerd Registry Configuration file] **************
  skipping: [chb-rke2s101]
  
  TASK [lablabs.rke2 : Register if we need to do a etcd restore from file] *******
  skipping: [chb-rke2s101]
  
  TASK [lablabs.rke2 : Register if we need to do a etcd restore from s3] *********
  skipping: [chb-rke2s101]
  
  TASK [lablabs.rke2 : Create the RKE2 etcd snapshot dir] ************************
  skipping: [chb-rke2s101]
  
  TASK [lablabs.rke2 : Copy etcd snapshot file] **********************************
  skipping: [chb-rke2s101]
  
  TASK [lablabs.rke2 : Restore etcd from a snapshot] *****************************
  skipping: [chb-rke2s101]
  
  TASK [lablabs.rke2 : Restore etcd from a s3 snapshot] **************************
  skipping: [chb-rke2s101]
  
  TASK [lablabs.rke2 : Start RKE2 service on the first server] *******************
  changed: [chb-rke2s101]
  
  TASK [lablabs.rke2 : Mask RKE2 agent service on the first server] **************
  changed: [chb-rke2s101]
  
  TASK [lablabs.rke2 : Wait for the first server be ready - no CNI] **************
  skipping: [chb-rke2s101]
  
  TASK [lablabs.rke2 : Wait for the first server be ready - with CNI] ************
  FAILED - RETRYING: [chb-rke2s101]: Wait for the first server be ready - with CNI (40 retries left).
  FAILED - RETRYING: [chb-rke2s101]: Wait for the first server be ready - with CNI (39 retries left).
  ok: [chb-rke2s101]
  
  TASK [lablabs.rke2 : Get registered nodes] *************************************
  skipping: [chb-rke2s101]
  
  TASK [lablabs.rke2 : Get all node names] ***************************************
  skipping: [chb-rke2s101]
  
  TASK [lablabs.rke2 : Remove old <node>.node-password.rke2 secrets] *************
  skipping: [chb-rke2s101]
  
  TASK [lablabs.rke2 : Remove old nodes] *****************************************
  skipping: [chb-rke2s101]
  
  TASK [lablabs.rke2 : Set an Active Server variable] ****************************
  ok: [chb-rke2s101] => (item=chb-rke2s101)
  ok: [chb-rke2s101 -> chb-rke2s201] => (item=chb-rke2s201)
  ok: [chb-rke2s101 -> chb-rke2s301] => (item=chb-rke2s301)
  ok: [chb-rke2s101 -> chb-rke2s102] => (item=chb-rke2s102)
  ok: [chb-rke2s101 -> chb-rke2s202] => (item=chb-rke2s202)
  ok: [chb-rke2s101 -> chb-rke2s302] => (item=chb-rke2s302)
  
  TASK [lablabs.rke2 : Restore etcd specific tasks] ******************************
  skipping: [chb-rke2s101]
  skipping: [chb-rke2s201]
  skipping: [chb-rke2s301]
  skipping: [chb-rke2s102]
  skipping: [chb-rke2s202]
  skipping: [chb-rke2s302]
  
  TASK [lablabs.rke2 : Download kubeconfig to ansible localhost] *****************
  skipping: [chb-rke2s201]
  skipping: [chb-rke2s301]
  skipping: [chb-rke2s102]
  skipping: [chb-rke2s202]
  skipping: [chb-rke2s302]
  included: /home/rocky/.ansible/roles/lablabs.rke2/tasks/download_kubeconfig.yaml for chb-rke2s101
  
  TASK [lablabs.rke2 : Download RKE2 kubeconfig to localhost] ********************
  changed: [chb-rke2s101]
  
  TASK [lablabs.rke2 : Replace loopback IP by master server IP] ******************
  changed: [chb-rke2s101 -> localhost]
  
  TASK [lablabs.rke2 : Prepare and join remaining nodes of the cluster] **********
  included: /home/rocky/.ansible/roles/lablabs.rke2/tasks/remaining_nodes.yml for chb-rke2s101, chb-rke2s201, chb-rke2s301, chb-rke2s102, chb-rke2s202, chb-rke2s302
  
  TASK [lablabs.rke2 : Create the RKE2 config dir] *******************************
  ok: [chb-rke2s101]
  changed: [chb-rke2s201]
  changed: [chb-rke2s102]
  changed: [chb-rke2s301]
  changed: [chb-rke2s302]
  changed: [chb-rke2s202]
  
  TASK [lablabs.rke2 : Set server taints] ****************************************
  ok: [chb-rke2s101]
  ok: [chb-rke2s201]
  ok: [chb-rke2s301]
  skipping: [chb-rke2s102]
  skipping: [chb-rke2s202]
  skipping: [chb-rke2s302]
  
  TASK [lablabs.rke2 : Set agent taints] *****************************************
  skipping: [chb-rke2s101]
  skipping: [chb-rke2s201]
  skipping: [chb-rke2s301]
  ok: [chb-rke2s102]
  ok: [chb-rke2s202]
  ok: [chb-rke2s302]
  
  TASK [lablabs.rke2 : Copy RKE2 config] *****************************************
  changed: [chb-rke2s101]
  changed: [chb-rke2s201]
  changed: [chb-rke2s301]
  changed: [chb-rke2s102]
  changed: [chb-rke2s202]
  changed: [chb-rke2s302]
  
  TASK [lablabs.rke2 : Copy kubelet config] **************************************
  skipping: [chb-rke2s101]
  skipping: [chb-rke2s201]
  skipping: [chb-rke2s301]
  skipping: [chb-rke2s102]
  skipping: [chb-rke2s202]
  skipping: [chb-rke2s302]
  
  TASK [lablabs.rke2 : Copy Containerd Registry Configuration file] **************
  skipping: [chb-rke2s101]
  skipping: [chb-rke2s201]
  skipping: [chb-rke2s301]
  skipping: [chb-rke2s102]
  skipping: [chb-rke2s202]
  skipping: [chb-rke2s302]
  
  TASK [lablabs.rke2 : Start RKE2 service on the rest of the nodes] **************
  ok: [chb-rke2s101]
  changed: [chb-rke2s202]
  changed: [chb-rke2s302]
  changed: [chb-rke2s102]
  changed: [chb-rke2s301]
  changed: [chb-rke2s201]
  
  TASK [lablabs.rke2 : Mask other RKE2 service on the rest of the nodes] *********
  ok: [chb-rke2s101] => (item=agent)
  changed: [chb-rke2s201] => (item=agent)
  changed: [chb-rke2s102] => (item=server)
  changed: [chb-rke2s301] => (item=agent)
  changed: [chb-rke2s202] => (item=server)
  changed: [chb-rke2s302] => (item=server)
  
  TASK [lablabs.rke2 : Wait for remaining nodes to be ready - no CNI] ************
  skipping: [chb-rke2s101] => (item=chb-rke2s101) 
  skipping: [chb-rke2s101] => (item=chb-rke2s201) 
  skipping: [chb-rke2s101] => (item=chb-rke2s301) 
  skipping: [chb-rke2s101] => (item=chb-rke2s102) 
  skipping: [chb-rke2s101] => (item=chb-rke2s202) 
  skipping: [chb-rke2s101] => (item=chb-rke2s302) 
  skipping: [chb-rke2s101]
  skipping: [chb-rke2s201] => (item=chb-rke2s101) 
  skipping: [chb-rke2s201] => (item=chb-rke2s201) 
  skipping: [chb-rke2s201] => (item=chb-rke2s301) 
  skipping: [chb-rke2s201] => (item=chb-rke2s102) 
  skipping: [chb-rke2s201] => (item=chb-rke2s202) 
  skipping: [chb-rke2s201] => (item=chb-rke2s302) 
  skipping: [chb-rke2s201]
  skipping: [chb-rke2s301] => (item=chb-rke2s101) 
  skipping: [chb-rke2s301] => (item=chb-rke2s201) 
  skipping: [chb-rke2s301] => (item=chb-rke2s301) 
  skipping: [chb-rke2s301] => (item=chb-rke2s102) 
  skipping: [chb-rke2s301] => (item=chb-rke2s202) 
  skipping: [chb-rke2s301] => (item=chb-rke2s302) 
  skipping: [chb-rke2s102] => (item=chb-rke2s101) 
  skipping: [chb-rke2s102] => (item=chb-rke2s201) 
  skipping: [chb-rke2s102] => (item=chb-rke2s301) 
  skipping: [chb-rke2s301]
  skipping: [chb-rke2s102] => (item=chb-rke2s102) 
  skipping: [chb-rke2s102] => (item=chb-rke2s202) 
  skipping: [chb-rke2s102] => (item=chb-rke2s302) 
  skipping: [chb-rke2s102]
  skipping: [chb-rke2s202] => (item=chb-rke2s101) 
  skipping: [chb-rke2s202] => (item=chb-rke2s201) 
  skipping: [chb-rke2s202] => (item=chb-rke2s301) 
  skipping: [chb-rke2s202] => (item=chb-rke2s102) 
  skipping: [chb-rke2s202] => (item=chb-rke2s202) 
  skipping: [chb-rke2s202] => (item=chb-rke2s302) 
  skipping: [chb-rke2s202]
  skipping: [chb-rke2s302] => (item=chb-rke2s101) 
  skipping: [chb-rke2s302] => (item=chb-rke2s201) 
  skipping: [chb-rke2s302] => (item=chb-rke2s301) 
  skipping: [chb-rke2s302] => (item=chb-rke2s102) 
  skipping: [chb-rke2s302] => (item=chb-rke2s202) 
  skipping: [chb-rke2s302] => (item=chb-rke2s302) 
  skipping: [chb-rke2s302]
  
  TASK [lablabs.rke2 : Wait for remaining nodes to be ready - with CNI] **********
  skipping: [chb-rke2s201]
  skipping: [chb-rke2s301]
  skipping: [chb-rke2s102]
  skipping: [chb-rke2s202]
  skipping: [chb-rke2s302]
  FAILED - RETRYING: [chb-rke2s101]: Wait for remaining nodes to be ready - with CNI (100 retries left).
  ok: [chb-rke2s101]
  
  TASK [lablabs.rke2 : Rolling cordon and drain restart when version changes - servers] ***
  skipping: [chb-rke2s101] => (item=chb-rke2s101) 
  skipping: [chb-rke2s101] => (item=chb-rke2s201) 
  skipping: [chb-rke2s101] => (item=chb-rke2s301) 
  skipping: [chb-rke2s201] => (item=chb-rke2s101) 
  skipping: [chb-rke2s101]
  skipping: [chb-rke2s301] => (item=chb-rke2s101) 
  skipping: [chb-rke2s301] => (item=chb-rke2s201) 
  skipping: [chb-rke2s301] => (item=chb-rke2s301) 
  skipping: [chb-rke2s201] => (item=chb-rke2s201) 
  skipping: [chb-rke2s301]
  skipping: [chb-rke2s201] => (item=chb-rke2s301) 
  skipping: [chb-rke2s102] => (item=chb-rke2s101) 
  skipping: [chb-rke2s201]
  skipping: [chb-rke2s102] => (item=chb-rke2s201) 
  skipping: [chb-rke2s102] => (item=chb-rke2s301) 
  skipping: [chb-rke2s102]
  skipping: [chb-rke2s202] => (item=chb-rke2s101) 
  skipping: [chb-rke2s202] => (item=chb-rke2s201) 
  skipping: [chb-rke2s202] => (item=chb-rke2s301) 
  skipping: [chb-rke2s202]
  skipping: [chb-rke2s302] => (item=chb-rke2s101) 
  skipping: [chb-rke2s302] => (item=chb-rke2s201) 
  skipping: [chb-rke2s302] => (item=chb-rke2s301) 
  skipping: [chb-rke2s302]
  
  TASK [lablabs.rke2 : Rolling cordon and drain restart when version changes - agents] ***
  skipping: [chb-rke2s101] => (item=chb-rke2s102) 
  skipping: [chb-rke2s101] => (item=chb-rke2s202) 
  skipping: [chb-rke2s101] => (item=chb-rke2s302) 
  skipping: [chb-rke2s101]
  skipping: [chb-rke2s201] => (item=chb-rke2s102) 
  skipping: [chb-rke2s301] => (item=chb-rke2s102) 
  skipping: [chb-rke2s201] => (item=chb-rke2s202) 
  skipping: [chb-rke2s201] => (item=chb-rke2s302) 
  skipping: [chb-rke2s201]
  skipping: [chb-rke2s301] => (item=chb-rke2s202) 
  skipping: [chb-rke2s102] => (item=chb-rke2s102) 
  skipping: [chb-rke2s102] => (item=chb-rke2s202) 
  skipping: [chb-rke2s301] => (item=chb-rke2s302) 
  skipping: [chb-rke2s301]
  skipping: [chb-rke2s102] => (item=chb-rke2s302) 
  skipping: [chb-rke2s102]
  skipping: [chb-rke2s202] => (item=chb-rke2s102) 
  skipping: [chb-rke2s302] => (item=chb-rke2s102) 
  skipping: [chb-rke2s202] => (item=chb-rke2s202) 
  skipping: [chb-rke2s302] => (item=chb-rke2s202) 
  skipping: [chb-rke2s202] => (item=chb-rke2s302) 
  skipping: [chb-rke2s202]
  skipping: [chb-rke2s302] => (item=chb-rke2s302) 
  skipping: [chb-rke2s302]
  
  TASK [lablabs.rke2 : Flush handlers] *******************************************
  
  TASK [lablabs.rke2 : Flush handlers] *******************************************
  
  TASK [lablabs.rke2 : Flush handlers] *******************************************
  
  TASK [lablabs.rke2 : Flush handlers] *******************************************
  
  TASK [lablabs.rke2 : Flush handlers] *******************************************
  
  TASK [lablabs.rke2 : Flush handlers] *******************************************
  
  RUNNING HANDLER [lablabs.rke2 : Config file changed] ***************************
  ok: [chb-rke2s101]
  ok: [chb-rke2s201]
  ok: [chb-rke2s301]
  ok: [chb-rke2s102]
  ok: [chb-rke2s202]
  ok: [chb-rke2s302]
  
  RUNNING HANDLER [lablabs.rke2 : Service (re)started] ***************************
  ok: [chb-rke2s101]
  ok: [chb-rke2s201]
  ok: [chb-rke2s301]
  ok: [chb-rke2s102]
  ok: [chb-rke2s202]
  ok: [chb-rke2s302]
  
  TASK [lablabs.rke2 : Rolling restart when config files change] *****************
  skipping: [chb-rke2s101] => (item=chb-rke2s101) 
  skipping: [chb-rke2s101] => (item=chb-rke2s201) 
  skipping: [chb-rke2s201] => (item=chb-rke2s101) 
  skipping: [chb-rke2s101] => (item=chb-rke2s301) 
  skipping: [chb-rke2s301] => (item=chb-rke2s101) 
  skipping: [chb-rke2s101] => (item=chb-rke2s102) 
  skipping: [chb-rke2s201] => (item=chb-rke2s201) 
  skipping: [chb-rke2s301] => (item=chb-rke2s201) 
  skipping: [chb-rke2s101] => (item=chb-rke2s202) 
  skipping: [chb-rke2s201] => (item=chb-rke2s301) 
  skipping: [chb-rke2s102] => (item=chb-rke2s101) 
  skipping: [chb-rke2s301] => (item=chb-rke2s301) 
  skipping: [chb-rke2s101] => (item=chb-rke2s302) 
  skipping: [chb-rke2s102] => (item=chb-rke2s201) 
  skipping: [chb-rke2s101]
  skipping: [chb-rke2s201] => (item=chb-rke2s102) 
  skipping: [chb-rke2s202] => (item=chb-rke2s101) 
  skipping: [chb-rke2s301] => (item=chb-rke2s102) 
  skipping: [chb-rke2s201] => (item=chb-rke2s202) 
  skipping: [chb-rke2s102] => (item=chb-rke2s301) 
  skipping: [chb-rke2s202] => (item=chb-rke2s201) 
  skipping: [chb-rke2s302] => (item=chb-rke2s101) 
  skipping: [chb-rke2s201] => (item=chb-rke2s302) 
  skipping: [chb-rke2s201]
  skipping: [chb-rke2s301] => (item=chb-rke2s202) 
  skipping: [chb-rke2s302] => (item=chb-rke2s201) 
  skipping: [chb-rke2s302] => (item=chb-rke2s301) 
  skipping: [chb-rke2s102] => (item=chb-rke2s102) 
  skipping: [chb-rke2s202] => (item=chb-rke2s301) 
  skipping: [chb-rke2s302] => (item=chb-rke2s102) 
  skipping: [chb-rke2s301] => (item=chb-rke2s302) 
  skipping: [chb-rke2s301]
  skipping: [chb-rke2s302] => (item=chb-rke2s202) 
  skipping: [chb-rke2s202] => (item=chb-rke2s102) 
  skipping: [chb-rke2s102] => (item=chb-rke2s202) 
  skipping: [chb-rke2s302] => (item=chb-rke2s302) 
  skipping: [chb-rke2s302]
  skipping: [chb-rke2s202] => (item=chb-rke2s202) 
  skipping: [chb-rke2s102] => (item=chb-rke2s302) 
  skipping: [chb-rke2s102]
  skipping: [chb-rke2s202] => (item=chb-rke2s302) 
  skipping: [chb-rke2s202]
  
  TASK [lablabs.rke2 : Final steps] **********************************************
  included: /home/rocky/.ansible/roles/lablabs.rke2/tasks/summary.yml for chb-rke2s101, chb-rke2s201, chb-rke2s301, chb-rke2s102, chb-rke2s202, chb-rke2s302
  
  TASK [lablabs.rke2 : Prepare summary] ******************************************
  skipping: [chb-rke2s201]
  skipping: [chb-rke2s301]
  skipping: [chb-rke2s102]
  skipping: [chb-rke2s202]
  skipping: [chb-rke2s302]
  ok: [chb-rke2s101]
  
  TASK [lablabs.rke2 : K8s nodes state] ******************************************
  ok: [chb-rke2s101] => {
      "nodes_summary.stdout_lines": [
          "NAME           STATUS   ROLES                       AGE    VERSION          INTERNAL-IP   EXTERNAL-IP   OS-IMAGE                      KERNEL-VERSION                 CONTAINER-RUNTIME         LABELS",
          "chb-rke2s101   Ready    control-plane,etcd,master   113s   v1.33.5+rke2r1   10.0.0.40     <none>        Rocky Linux 9.6 (Blue Onyx)   5.14.0-570.58.1.el9_6.x86_64   containerd://2.1.4-k3s2   beta.kubernetes.io/arch=amd64,beta.kubernetes.io/instance-type=rke2,beta.kubernetes.io/os=linux,kubernetes.io/arch=amd64,kubernetes.io/hostname=chb-rke2s101,kubernetes.io/os=linux,node-role.kubernetes.io/control-plane=true,node-role.kubernetes.io/etcd=true,node-role.kubernetes.io/master=true,node.kubernetes.io/instance-type=rke2",
          "chb-rke2s102   Ready    <none>                      57s    v1.33.5+rke2r1   10.0.0.52     <none>        Rocky Linux 9.6 (Blue Onyx)   5.14.0-570.58.1.el9_6.x86_64   containerd://2.1.4-k3s2   beta.kubernetes.io/arch=amd64,beta.kubernetes.io/instance-type=rke2,beta.kubernetes.io/os=linux,kubernetes.io/arch=amd64,kubernetes.io/hostname=chb-rke2s102,kubernetes.io/os=linux,node.kubernetes.io/instance-type=rke2",
          "chb-rke2s201   Ready    control-plane,etcd,master   24s    v1.33.5+rke2r1   10.0.0.89     <none>        Rocky Linux 9.6 (Blue Onyx)   5.14.0-570.58.1.el9_6.x86_64   containerd://2.1.4-k3s2   beta.kubernetes.io/arch=amd64,beta.kubernetes.io/instance-type=rke2,beta.kubernetes.io/os=linux,kubernetes.io/arch=amd64,kubernetes.io/hostname=chb-rke2s201,kubernetes.io/os=linux,node-role.kubernetes.io/control-plane=true,node-role.kubernetes.io/etcd=true,node-role.kubernetes.io/master=true,node.kubernetes.io/instance-type=rke2",
          "chb-rke2s202   Ready    <none>                      58s    v1.33.5+rke2r1   10.0.0.93     <none>        Rocky Linux 9.6 (Blue Onyx)   5.14.0-570.58.1.el9_6.x86_64   containerd://2.1.4-k3s2   beta.kubernetes.io/arch=amd64,beta.kubernetes.io/instance-type=rke2,beta.kubernetes.io/os=linux,kubernetes.io/arch=amd64,kubernetes.io/hostname=chb-rke2s202,kubernetes.io/os=linux,node.kubernetes.io/instance-type=rke2",
          "chb-rke2s301   Ready    control-plane,etcd,master   38s    v1.33.5+rke2r1   10.0.0.102    <none>        Rocky Linux 9.6 (Blue Onyx)   5.14.0-570.58.1.el9_6.x86_64   containerd://2.1.4-k3s2   beta.kubernetes.io/arch=amd64,beta.kubernetes.io/instance-type=rke2,beta.kubernetes.io/os=linux,kubernetes.io/arch=amd64,kubernetes.io/hostname=chb-rke2s301,kubernetes.io/os=linux,node-role.kubernetes.io/control-plane=true,node-role.kubernetes.io/etcd=true,node-role.kubernetes.io/master=true,node.kubernetes.io/instance-type=rke2",
          "chb-rke2s302   Ready    <none>                      58s    v1.33.5+rke2r1   10.0.0.115    <none>        Rocky Linux 9.6 (Blue Onyx)   5.14.0-570.58.1.el9_6.x86_64   containerd://2.1.4-k3s2   beta.kubernetes.io/arch=amd64,beta.kubernetes.io/instance-type=rke2,beta.kubernetes.io/os=linux,kubernetes.io/arch=amd64,kubernetes.io/hostname=chb-rke2s302,kubernetes.io/os=linux,node.kubernetes.io/instance-type=rke2"
      ]
  }
  skipping: [chb-rke2s201]
  skipping: [chb-rke2s301]
  skipping: [chb-rke2s102]
  skipping: [chb-rke2s202]
  skipping: [chb-rke2s302]
  
  PLAY RECAP *********************************************************************
  chb-rke2s101               : ok=40   changed=12   unreachable=0    failed=0    skipped=45   rescued=0    ignored=0   
  chb-rke2s102               : ok=23   changed=7    unreachable=0    failed=0    skipped=38   rescued=0    ignored=0   
  chb-rke2s201               : ok=23   changed=7    unreachable=0    failed=0    skipped=38   rescued=0    ignored=0   
  chb-rke2s202               : ok=23   changed=7    unreachable=0    failed=0    skipped=38   rescued=0    ignored=0   
  chb-rke2s301               : ok=23   changed=7    unreachable=0    failed=0    skipped=38   rescued=0    ignored=0   
  chb-rke2s302               : ok=23   changed=7    unreachable=0    failed=0    skipped=38   rescued=0    ignored=0   
```
  
#### Prepare cert manager and CAs
Install and configure cert manager and create certificate 

```
cd ~/bare-metal/ansible
ansible-playbook -i 127.0.0.1, --connection=local manage_helm_applications.yml
```

Output:

```
PLAY [Install Helm Applications] ***********************************************************************************************************************************************************

TASK [Ensure Kubernetes Python client is installed] ****************************************************************************************************************************************
ok: [127.0.0.1]

TASK [Add cert-manager Helm repository] ****************************************************************************************************************************************************
ok: [127.0.0.1]

TASK [Add rancher Helm repository] *********************************************************************************************************************************************************
ok: [127.0.0.1]

TASK [Install cert-manager Helm chart] *****************************************************************************************************************************************************
changed: [127.0.0.1]

TASK [Install trust-manager Helm chart] ****************************************************************************************************************************************************
changed: [127.0.0.1]

TASK [Create cert-manager selfsigned-issuer] ***********************************************************************************************************************************************
changed: [127.0.0.1]

TASK [Create cert-manager selfsigned-ca certificate] ***************************************************************************************************************************************
changed: [127.0.0.1]

TASK [Create cert-manager selfsinged-ca certificate issuer] ********************************************************************************************************************************
changed: [127.0.0.1]

TASK [Ensure cattle-system namespace exists] ***********************************************************************************************************************************************
changed: [127.0.0.1]

TASK [Ensure tls-rancher-ingress secret is created] ****************************************************************************************************************************************
changed: [127.0.0.1]

TASK [Get cert-manager selfsinged-ca certificate] ******************************************************************************************************************************************
ok: [127.0.0.1]

TASK [Copy cert-manager selfsigned-ca certificate to tls-ca secret in cattle-system namespace] *********************************************************************************************
changed: [127.0.0.1]

TASK [Install Rancher] *********************************************************************************************************************************************************************
changed: [127.0.0.1]

TASK [Ensure clickhouse cluster namespace exists] ******************************************************************************************************************************************
changed: [127.0.0.1]

TASK [Create clickhouse cert-manager certificates] *****************************************************************************************************************************************
changed: [127.0.0.1]

TASK [Get cert-manager selfsinged-ca certificate] ******************************************************************************************************************************************
ok: [127.0.0.1]

TASK [Copy cert-manager clickhouse certificates to keeper secret] **************************************************************************************************************************
changed: [127.0.0.1]

TASK [Copy cert-manager clickhouse certificates to server secret] **************************************************************************************************************************
changed: [127.0.0.1]

PLAY RECAP *********************************************************************************************************************************************************************************
127.0.0.1                  : ok=18   changed=13   unreachable=0    failed=0    skipped=0    rescued=0    ignored=0  
```

##### Local storage

Install [local storage driver](https://raw.githubusercontent.com/rancher/local-path-provisioner/v0.0.32/deploy/local-path-storage.yaml)

```
kubectl apply -f https://raw.githubusercontent.com/rancher/local-path-provisioner/v0.0.32/deploy/local-path-storage.yaml
```

Storage class 

```
cd ~/bare-metal/ch-cluster-deployment
kubectl apply -f local-nvme-sc.yaml
```
  
Contents:
```
  # To apply the changes, save this as local-nvme-sc.yaml 
  # and use 'kubectl apply -f local-nvme-sc.yaml' or 'kubectl patch sc local-nvme-sc --patch "$(cat local-nvme-sc.yaml)"'
  apiVersion: storage.k8s.io/v1
  kind: StorageClass
  metadata:
    name: local-nvme-sc
  allowVolumeExpansion: true
  parameters:
    path: /nvme/disk
  provisioner: rancher.io/local-path
  reclaimPolicy: Delete
  volumeBindingMode: WaitForFirstConsumer
  allowedTopologies:
  - matchLabelExpressions:
      - key: topology.kubernetes.io/zone
        values:
          - c-baremetal-ch-01-keeper
          - chb-rke2s101
          - chb-rke2s102
          - chb-rke2s201
          - chb-rke2s202
          - chb-rke2s301
          - chb-rke2s302

      - key: directpv.min.io/region
        values:
          - default
```
  
#### MinIO prep

##### Install [operator](https://github.com/minio/operator)

```
helm install --namespace minio-operator --create-namespace operator minio-operator/operator
```

##### Create namespace

```
kubectl create namespace chb-minio
```

##### Install [directpv plugin](https://www.min.io/directpv)

```
kubectl directpv install
```

Output:
```
  Installing on unsupported Kubernetes v1.33

   ███████████████████████████████████████████████████████████████████████████ 100%

  ┌──────────────────────────────────────┬──────────────────────────┐
  │ NAME                                 │ KIND                     │
  ├──────────────────────────────────────┼──────────────────────────┤
  │ directpv                             │ Namespace                │
  │ directpv-min-io                      │ ServiceAccount           │
  │ directpv-min-io                      │ ClusterRole              │
  │ directpv-min-io                      │ ClusterRoleBinding       │
  │ directpv-min-io                      │ Role                     │
  │ directpv-min-io                      │ RoleBinding              │
  │ directpvdrives.directpv.min.io       │ CustomResourceDefinition │
  │ directpvvolumes.directpv.min.io      │ CustomResourceDefinition │
  │ directpvnodes.directpv.min.io        │ CustomResourceDefinition │
  │ directpvinitrequests.directpv.min.io │ CustomResourceDefinition │
  │ directpv-min-io                      │ CSIDriver                │
  │ directpv-min-io                      │ StorageClass             │
  │ node-server                          │ Daemonset                │
  │ controller                           │ Deployment               │
  └──────────────────────────────────────┴──────────────────────────┘
  
  DirectPV installed successfully
```

#####  Create directpv volumes, if necessary

```
kubectl directpv discover
```

Output:
```
   Discovered node 'chb-rke2s101' ✔
   Discovered node 'chb-rke2s102' ✔
   Discovered node 'chb-rke2s201' ✔
   Discovered node 'chb-rke2s202' ✔
   Discovered node 'chb-rke2s301' ✔
   Discovered node 'chb-rke2s302' ✔
  
  ┌─────────────────────┬──────────────┬─────────┬─────────┬────────────┬──────────────────────────────────┬───────────┬─────────────┐
  │ ID                  │ NODE         │ DRIVE   │ SIZE    │ FILESYSTEM │ MAKE                             │ AVAILABLE │ DESCRIPTION │
  ├─────────────────────┼──────────────┼─────────┼─────────┼────────────┼──────────────────────────────────┼───────────┼─────────────┤
  │ 259:2$IhXWNTnY+j... │ chb-rke2s101 │ nvme1n1 │ 838 GiB │ -          │ Amazon EC2 NVMe Instance Storage │ YES       │ -           │
  │ 259:7$lJWnetuS1k... │ chb-rke2s101 │ nvme4n1 │ 838 GiB │ -          │ Amazon EC2 NVMe Instance Storage │ YES       │ -           │
  │ 259:7$jaiDId1qF/... │ chb-rke2s102 │ nvme1n1 │ 838 GiB │ -          │ Amazon EC2 NVMe Instance Storage │ YES       │ -           │
  │ 259:6$a9BrMv8CbG... │ chb-rke2s102 │ nvme4n1 │ 838 GiB │ -          │ Amazon EC2 NVMe Instance Storage │ YES       │ -           │
  │ 259:2$zP0HmacZZ2... │ chb-rke2s201 │ nvme1n1 │ 838 GiB │ -          │ Amazon EC2 NVMe Instance Storage │ YES       │ -           │
  │ 259:5$VMeZn0gUSR... │ chb-rke2s201 │ nvme4n1 │ 838 GiB │ -          │ Amazon EC2 NVMe Instance Storage │ YES       │ -           │
  │ 259:3$I19gm6Olbt... │ chb-rke2s202 │ nvme1n1 │ 838 GiB │ -          │ Amazon EC2 NVMe Instance Storage │ YES       │ -           │
  │ 259:4$6B3ibZAYHL... │ chb-rke2s202 │ nvme4n1 │ 838 GiB │ -          │ Amazon EC2 NVMe Instance Storage │ YES       │ -           │
  │ 259:4$pQfc9lGm4i... │ chb-rke2s301 │ nvme1n1 │ 838 GiB │ -          │ Amazon EC2 NVMe Instance Storage │ YES       │ -           │
  │ 259:0$ktb6IJudan... │ chb-rke2s301 │ nvme4n1 │ 838 GiB │ -          │ Amazon EC2 NVMe Instance Storage │ YES       │ -           │
  │ 259:2$9H9U7ECUcd... │ chb-rke2s302 │ nvme1n1 │ 838 GiB │ -          │ Amazon EC2 NVMe Instance Storage │ YES       │ -           │
  │ 259:3$cAmjnppmEH... │ chb-rke2s302 │ nvme4n1 │ 838 GiB │ -          │ Amazon EC2 NVMe Instance Storage │ YES       │ -           │
  └─────────────────────┴──────────────┴─────────┴─────────┴────────────┴──────────────────────────────────┴───────────┴─────────────┘

  Generated 'drives.yaml' successfully.
```

* If response is "No drives are available to initialize" then don't do the init! *

```
kubectl directpv init drives.yaml --dangerous

```

```
  Processed initialization request '9f4366cb-f57c-4810-9862-2a8977861e6b' for node 'chb-rke2s101' ✔
  Processed initialization request '6b5e8ca7-b469-436b-a9fb-348e480cf136' for node 'chb-rke2s102' ✔
  Processed initialization request '4983a4eb-74a0-4ea9-b080-130df356233c' for node 'chb-rke2s201' ✔
  Processed initialization request '62e87bec-5179-4156-bc2a-7307ec419391' for node 'chb-rke2s202' ✔
  Processed initialization request 'fc084ff6-6411-4569-bd04-3c964a05a691' for node 'chb-rke2s301' ✔
  Processed initialization request 'ef2e9ba2-6577-4ebf-ae03-8f22c51d26a7' for node 'chb-rke2s302' ✔
  
  ┌──────────────────────────────────────┬──────────────┬─────────┬─────────┐
  │ REQUEST_ID                           │ NODE         │ DRIVE   │ MESSAGE │
  ├──────────────────────────────────────┼──────────────┼─────────┼─────────┤
  │ 9f4366cb-f57c-4810-9862-2a8977861e6b │ chb-rke2s101 │ nvme1n1 │ Success │
  │ 9f4366cb-f57c-4810-9862-2a8977861e6b │ chb-rke2s101 │ nvme4n1 │ Success │
  │ 6b5e8ca7-b469-436b-a9fb-348e480cf136 │ chb-rke2s102 │ nvme1n1 │ Success │
  │ 6b5e8ca7-b469-436b-a9fb-348e480cf136 │ chb-rke2s102 │ nvme4n1 │ Success │
  │ 4983a4eb-74a0-4ea9-b080-130df356233c │ chb-rke2s201 │ nvme1n1 │ Success │
  │ 4983a4eb-74a0-4ea9-b080-130df356233c │ chb-rke2s201 │ nvme4n1 │ Success │
  │ 62e87bec-5179-4156-bc2a-7307ec419391 │ chb-rke2s202 │ nvme1n1 │ Success │
  │ 62e87bec-5179-4156-bc2a-7307ec419391 │ chb-rke2s202 │ nvme4n1 │ Success │
  │ fc084ff6-6411-4569-bd04-3c964a05a691 │ chb-rke2s301 │ nvme1n1 │ Success │
  │ fc084ff6-6411-4569-bd04-3c964a05a691 │ chb-rke2s301 │ nvme4n1 │ Success │
  │ ef2e9ba2-6577-4ebf-ae03-8f22c51d26a7 │ chb-rke2s302 │ nvme1n1 │ Success │
  │ ef2e9ba2-6577-4ebf-ae03-8f22c51d26a7 │ chb-rke2s302 │ nvme4n1 │ Success │
  └──────────────────────────────────────┴──────────────┴─────────┴─────────┘
```
  

#### Install MinIO operator

```
helm install --namespace minio-operator --create-namespace operator minio-operator/operator
```

#### Install MinIO tenant

```
helm install --namespace chb-minio --create-namespace --values <(envsubst < minio-values.yaml) chb-minio minio-operator/tenant
```

*Note: minio-values.yaml is a modified version of [https://docs.min.io/community/minio-object-store/reference/tenant-chart-values.html](https://docs.min.io/community/minio-object-store/reference/tenant-chart-values.html)*

#### Apply certs for MinIO

```
cd ~/cert-manager-minio/
kubectl apply -f operator-ca-issuer.yml
# Ignore this - error: the path "operator-ca-ts-certificate.yml" does not exist
kubectl apply -f operator-ca-ts-certificate.yml
kubectl apply -f sts-tls-certificate.yml
kubectl apply -f minio-operator-patch-tls.yml
# error: resource mapping not found for name: "" namespace: "" from "minio-operator-patch-tls.yml": no matches for kind "Kustomization" in version "kustomize.config.k8s.io/v1beta1" ensure CRDs are installed first
kubectl apply -f chb-tenant-ca-issuer.yml
kubectl apply -f chb-tenant-certificate.yml
kubectl apply -f chb-tenant-ca-request.yml
```

#### Configure MinIO bucket and key

```
kubectl port-forward svc/myminio-console 9443:9443 -n chb-minio &
```

- Make sure you are also port forwarding via ssh so you can get to the UI from your local host.
- Log in using the username and password from the provisioning host's environemnt variables:  
  - MINIO_ACCESS_KEY
  - MINIO_SECRET_KEY

- Create bucket (https://localhost:9443/browser/add-bucket)
  Use value of environment variable S3_BUCKET_NAME
- Create access key (https://localhost:9443/access-keys/new-account)
  Use values of environment variables:
  - S3_ACCESS_KEY_ID
  - S3_SECRET_ACCESS_KEY


##### Label nodes in prep for ClickHouse Keeper and Server pods

```
kubectl get nodes |awk '{ print $1}'|grep '01'|xargs -I {} -n 1 kubectl label nodes '{}' clickhouseGroup=keeper-amd64  topology.kubernetes.io/zone=c-baremetal-ch-01-keeper --overwrite
kubectl get nodes |awk '{ print $1}'|grep '02'|xargs -I {} -n 1 kubectl label nodes '{}' clickhouseGroup=server-amd64  --overwrite
kubectl label nodes chb-rke2s102 topology.kubernetes.io/zone=chb-rke2s102 --overwrite
kubectl label nodes chb-rke2s202 topology.kubernetes.io/zone=chb-rke2s202 --overwrite
kubectl label nodes chb-rke2s302 topology.kubernetes.io/zone=chb-rke2s302 --overwrite
```

### ClickHouse Installation Notes on Bare metal 

This document outlines the steps and commands for installing ClickHouse on a Bare-metal deployment.  It is assumed that you have a Kubernetes cluster built and access to a container registry. 

#### Helm Chart Configuration (clickhouse-values.yaml) 
This section outlines the structure and key parameters for your clickhouse values file, which will be used by Helm. 


```yaml
imagePullSecrets:
- name: all-icr-io

account:
  hashedPassword: "$HASHED_PASSWORD"
server:
  ssdCacheConfiguration:
    cacheDiskSize: "$CACHE_DISK_SIZE_GI"
  openSSL:
    enabled: true
    required: true
    selfSigned: true
  replicaCount: 3
  arm64: false
  podPolicy:
    nodeSelector:
      clickhouseGroup: "$SERVER_NG_GROUP"
    resources:
      limits:
        cpu: "$SERVER_CPU" 
        memory: "$SERVER_MEMORY" 
      requests:
        cpu: "$SERVER_CPU" 
        memory: "$SERVER_MEMORY" 
  tolerations: 
    - effect: NoSchedule
      key: "clickhouse.com/do-not-schedule"
      operator: Exists
  storage:
    storageClassName: local-nvme-sc
    resources:
      requests: "300Gi"
    s3:
      bucketName: "$S3_BUCKET_NAME"
      keyPrefix: "$S3_KEY_PREFIX" 
      endpoint: "$S3_ENDPOINT"
      region: "$S3_REGION"
  image:
    repository: "$ECR_HOST/clickhouse-server"
    tag: "25.6.2.5781"
  additionalEnvVars:
    - name: AWS_ACCESS_KEY_ID
      value: "${S3_ACCESS_KEY_ID}"
    - name: AWS_SECRET_ACCESS_KEY
      value: "${S3_SECRET_ACCESS_KEY}"


keeper:
  openSSL:
    enabled: true
    required: true
    selfSigned: true
  image:
    repository: "$ECR_HOST/clickhouse-keeper"
    tag: "25.2.1.30176"

  arm64: false 
  podPolicy:
    nodeSelector:
      clickhouseGroup: "$KEEPER_NG_GROUP"
    resources:
      limits:
        cpu: "$KEEPER_CPU" 
        memory: "$KEEPER_MEMORY" 
      requests:
        cpu: "$KEEPER_CPU" 
        memory: "$KEEPER_MEMORY" 
  tolerations: 
    - effect: NoSchedule
      key: "clickhouse.com/do-not-schedule"
      operator: Exists
  storage:
    storageClassName: local-nvme-sc
    resources:
      requests: 30Gi

serviceAccount:
  create: false
  name: default

storageClass:
  create: false
  name: local-nvme-sc
  provisioner: rancher.io/local-path
```

#### Quick deploy 

Scripts can be found here: `<<EXAMPLES_LINK>>`

- [./1_set-helm-vars.sh](#1-helm-variables-script-1_set-helm-varssh)

- [./2_helm_install_operator.sh](#2-install-clickhouse-operator-2_helm_install_operatorsh)

- [./3_helm_install_clickhouse.sh](#3-install-clickhouse-cluster-3_helm_install_clickhousesh)

    *Note: Wait for keeper pods to deploy.* 

- [./4_fix_keeper_sts.sh](#4-fix-keeper-statefulset-4_fix_keeper_stssh)

    *Note: Wait for Keeper pods to redeploy.*

- [./5_fix_server_pvs.sh](#5-fix-server-pvs-5_fix_server_pvssh)


#### Details 

##### 1. Helm Variables Script (1_set-helm-vars.sh) 

This script defines all the environment variables needed for the Helm deployment. 

```bash
#!/bin/bash
# AWS/S3 creds
export AWS_ACCESS_KEY_ID=<your_aws_key>
export AWS_SECRET_ACCESS_KEY=<your_aws_secret>
export AWS_REGION=<your_aws_region>
export S3_ACCESS_KEY_ID=<s3_or_minio_key>
export S3_SECRET_ACCESS_KEY=<s3_or_minio_secret>
export S3_REGION=us-east-1
export ECR_HOST=<ecr_host>
# Set AZs as determined by VPC subnets.   If not relevant then use your k8s host names.
export AZ_LIST='["<your_host_1>", "<your_host_2>", "<your_host_3>","<your_host_4>", "<your_host_5>", "<your_host_6>"]'

# List of required environment variables
REQUIRED_VARS=(
    "AWS_ACCESS_KEY_ID"
    "AWS_SECRET_ACCESS_KEY"
    "AWS_REGION"
    "S3_ACCESS_KEY_ID"
    "S3_SECRET_ACCESS_KEY"
    "S3_REGION"
    "ECR_HOST"
    "MINIO_TENANT_NAME"
    "MINIO_ACCESS_KEY"
    "MINIO_SECRET_KEY"
)

# Initialize a flag to track if any variables are missing
MISSING_VARS=0

# Loop through the array of required variables
for VAR in "${REQUIRED_VARS[@]}"; do
    # Check if the variable is set and not empty
    if [ -z "${!VAR}" ]; then
        echo "🚨 ERROR: Required environment variable ${VAR} is not set."
        MISSING_VARS=1
    fi
done

# Final status message
if [ "$MISSING_VARS" -eq 0 ]; then
    echo "✅ Success! All required environment variables are set."
else
    echo "❌ Please set the missing environment variables and try again."
    exit 1 # Exit with a non-zero status to indicate failure
fi

PASSWORD='My super secret p@$$w0rd'
export HASHED_PASSWORD=$(echo -n "$PASSWORD" | sha256sum | awk '{printf $1}' | base64 -w 0)
export CLUSTER_NAME="baremetal-ch-01"
export CHART_VERSION="1.1.84"

export SERVER_NG_GROUP="server-amd64"
export KEEPER_NG_GROUP="keeper-amd64"
export KEEPER_CPU="4"
export KEEPER_MEMORY="16Gi"

#export SERVER_CPU="7"
export SERVER_MEMORY="128Gi" # need 406948151296 disk
export SERVER_CPU="64"
#export CACHE_DISK_SIZE_GI=379Gi
export CACHE_DISK_SIZE_GI=10Gi
#export SERVER_MEMORY="128Gi"
TARGET_SCRIPT_FULL_PATH="$(dirname "${BASH_SOURCE[0]}")/set_helm_vars.sh"
SYMLINK_FULL_PATH="$(dirname "${BASH_SOURCE[0]}")/$(basename "${BASH_SOURCE[0]}")"
if [[ "$(basename "${BASH_SOURCE[0]}")" != "set_helm_vars.sh" ]]; then
  ln -sf  "${SYMLINK_FULL_PATH}" "${TARGET_SCRIPT_FULL_PATH}"
fi
```

##### 2. Install ClickHouse Operator (2_helm_install_operator.sh) 

This script installs or upgrades the ClickHouse Operator using Helm, configuring it with the necessary image repository, feature flags, and availability zones. 


```bash
# update ECR_HOST as needed
source set_helm_vars.sh

# Ensure that the user is logged into the helm registry
aws ecr get-login-password  | helm registry login --username AWS --password-stdin 359774249275.dkr.ecr.us-east-2.amazonaws.com

# Ensure that the secret is present to pull the operator images
kubectl delete secret all-icr-io -n clickhouse-operator-system  # cleanup previous secret in case it is stale
kubectl create secret docker-registry all-icr-io --docker-server=$ECR_HOST --docker-username=AWS --docker-password=$(aws ecr get-login-password) -n clickhouse-operator-system
# should use the version of the operator's helm chart, not of the operator itself (eg 1.11917.1, not main.1.11917.1)
OPERATOR_VERSION=1.13500.1
# You can leave the IMAGE_TAG out, or override the default like below.
IMAGE_TAG=<special_tag_if_applicable>

HELM_CMD=(
  helm upgrade clickhouse-operator
  oci://$ECR_HOST/helm/clickhouse-operator-helm
  --install --reuse-values
  --version="$OPERATOR_VERSION"
  --create-namespace
  -n clickhouse-operator-system
  --set-json="image.repository=\"$ECR_HOST/clickhouse-operator\""
  --set-json='cilium.enabled=false'
  --set-json='idleScalerEnabled=false'
  --set-json='webhooks.enabled=false'
  --set-json='operator.debug=true'
  --set-json='operator.metricsScraper.enabled=false'
  --set-json='operator.featureFlags.backupOnASeparatePod=true'
  --set-json='operator.featureFlags.serverCMEKEnabled=true'
  --set-json 'imagePullSecrets=[{"name":"all-icr-io"}]'
  --set-json="operator.availabilityZones=$AZ_LIST"
)

# Ensure that the secret is present to pull the operator images
kubectl create secret docker-registry all-icr-io --docker-server=$ECR_HOST--docker-username=AWS --docker-password=$(aws ecr get-login-password) -n clickhouse-operator-system

# Conditionally add the IMAGE_TAG argument if the variable is set and non-empty
if [[ -n "$IMAGE_TAG" ]]; then
  HELM_CMD+=( --set-json="image.tag=\"$IMAGE_TAG\"" )
fi

# Execute the command
"${HELM_CMD[@]}"
```

###### If error such as this, then you need to log into the Helm registry:

```
Error: unexpected status from HEAD request to https://359774249275.dkr.ecr.us-east-2.amazonaws.com/v2/bearing/helm/clickhouse-operator-helm/manifests/1.13538.1: 403 Forbidden
```

##### 3. Install ClickHouse Cluster (3_helm_install_clickhouse.sh) 

###### *Optional:  If you don't have a local storage driver and plan to use one, here is an example of how to set one up with nvme.*

- Install local storage driver

```bash
kubectl apply -f https://raw.githubusercontent.com/rancher/local-path-provisioner/v0.0.32/deploy/local-path-storage.yaml
```
- Storage class

```bash
kubectl apply -f storage_class_local.yaml
```

Contents:
```yaml
  apiVersion: storage.k8s.io/v1
  kind: StorageClass
  metadata:
    name: local-nvme-sc
  allowVolumeExpansion: true
  parameters:
    path: /nvme/disk
  provisioner: rancher.io/local-path
  reclaimPolicy: Delete
  volumeBindingMode: WaitForFirstConsumer
  allowedTopologies:
    - matchLabelExpressions:
        - key: topology.kubernetes.io/zone
          values:
            - <your_cluster_name>-keeper
            - <your_host_1>
            - <your_host_2>
            - <your_host_3>
            - <your_host_4>
            - <your_host_5>
            - <your_host_6>
  
        - key: directpv.min.io/region
          values:
            - default
```
  
###### Run 3_helm_install_clickhouse.sh

This script automates the Helm installation/upgrade process for the main ClickHouse cluster, sourcing variables and preparing the values file. 
  
```bash
  #!/bin/bash
  source ./set_helm_vars.sh
  
  # Prepare a temporary values file by expanding variables in my-dynamic-values.yaml.
  echo "Expanding YAML values from my-dynamic-values.yaml using envsubst..."
  TEMP_VALUES_FILE=$(mktemp) # Create a unique temporary file
  if ! envsubst < clickhouse-values.yaml > "$TEMP_VALUES_FILE"; then
      echo "Error: Failed to expand variables in my-dynamic-values.yaml using envsubst."
      rm -f "$TEMP_VALUES_FILE" # Clean up temp file on error
      exit 1
  fi
  
  # Create namespace for cluster
  kubectl create namespace ns-$CLUSTER_NAME
  
  # Ensure that the docker registry secret is fresh.
  kubectl create secret docker-registry all-icr-io --docker-server=359774249275.dkr.ecr.us-east-2.amazonaws.com --docker-username=AWS --docker-password=$(aws ecr get-login-password) -n ns-$CLUSTER_NAM
  
  echo "Performing helm install for release '$CLUSTER_NAME'..."
  if ! helm upgrade "$CLUSTER_NAME" \
    oci://$ECR_HOST/helm/onprem-clickhouse-cluster \
    --install --reuse-values \
    --version="$CHART_VERSION" \
    -n ns-$CLUSTER_NAME \
    --create-namespace \
    --values "$TEMP_VALUES_FILE" \
    --timeout 10m0s; then
      echo "Error: Helm upgrade failed. Please review the output above for details."
      rm -f "$TEMP_VALUES_FILE" # Clean up temp file on error
      exit 1
  fi
  
  echo "Helm install completed successfully!"
  
  # 5. Clean up the temporary values file.
  echo "Cleaning up temporary values file..."
  rm "$TEMP_VALUES_FILE"
  
  # 6. Monitor the pods to see the effect of the upgrade.
  echo "Monitoring pod status in namespace 'clickhouse-operator-system' (Ctrl+C to exit monitoring):"
  kubectl get pods -n clickhouse-operator-system -w
  
  echo "--- Helm Upgrade Process Complete ---"
```

##### 4. Fix Keeper StatefulSet (4_fix_keeper_sts.sh) 

This script is used to patch the Kubernetes secret and the StatefulSet for the ClickHouse Keeper, which can be crucial for resolving certain access issues related to image pull secrets or environment variables. It ensures the keeper pods can correctly access necessary resources. 

```bash
source set_helm_vars.sh
kubectl get secret all-icr-io -n default -o yaml | \
          sed "s/namespace: default/namespace: ns-$CLUSTER_NAME/" | \
            kubectl apply -n ns-$CLUSTER_NAME --force -f -
kubectl patch sts c-$CLUSTER_NAME-keeper -n ns-$CLUSTER_NAME --patch "$(envsubst < sts_keeper_patch_template.yaml)"
kubectl delete pod c-$CLUSTER_NAME-keeper-{0,1,2} -n ns-$CLUSTER_NAME
```

###### sts_keeper_patch_template.yaml 
  
This YAML template is used by the 5_fix_keeper_sts.sh script to patch the ClickHouse Keeper StatefulSet. It adds imagePullSecrets and injects AWS access key and secret key as environment variables into the keeper container. 

```yaml
  apiVersion: apps/v1
  kind: StatefulSet
  metadata:
    name: c-$CLUSTER_NAME-keeper
    namespace: ns-$CLUSTER_NAME
  spec:
    template:
      spec:
        imagePullSecrets:
          - name: all-icr-io
        containers:
          - name: c-$CLUSTER_NAME-keeper
            env:
            - name: AWS_ACCESS_KEY_ID
              value: $S3_ACCESS_KEY_ID
            - name: AWS_SECRET_ACCESS_KEY
              value: $S3_SECRET_ACCESS_KEY
```

##### 5. Fix Server PVs (5_fix_server_pvs.sh) 

This script addresses issues where ClickHouse server pods might be stuck in a 0/1 ready state due to Persistent Volume (PV) topology label mismatches. It updates deprecated failure-domain.beta.kubernetes.io/ labels to topology.kubernetes.io/region and topology.kubernetes.io/zone, ensuring proper scheduling and functionality. It also attempts to apply image pull secrets and deletes server pods to trigger a re-creation with the correct configurations. 

```bash
source set_helm_vars.sh
./sts_server_patch.sh "ns-$CLUSTER_NAME" all-icr-io
kubectl delete pod -l kind=clickhouse-server
```


###### sts_server_patch.sh 

This script is designed to patch the StatefulSets of ClickHouse server pods. It ensures that the necessary image pull secret is applied to the server StatefulSets, which is critical for pulling container images from private registries like IBM Cloud Container Registry. It also includes error handling and informs the user that a pod restart is needed for changes to take effect. 

```bash
#!/bin/bash
# Exit immediately if a command exits with a non-zero status.
set -euo pipefail

# --- Configuration & Validation ---
# The namespace and secret name are now passed as arguments.

if [ "$#" -ne 2 ]; then
  echo "Usage: $0 <NAMESPACE> <IMAGE_PULL_SECRET_NAME>"
  echo "Example: $0 ns-my-cluster all-icr-io"
  exit 1
fi

TARGET_NAMESPACE="$1"
SECRET_NAME="$2"

# --- Script Logic ---

echo "--> Verifying secret '$SECRET_NAME' in namespace '$TARGET_NAMESPACE'..."
# 'set -e' will cause the script to exit if the secret is not found.
kubectl get secret "$SECRET_NAME" -n "$TARGET_NAMESPACE" >/dev/null
echo "    Secret found. Proceeding."

echo "--> Finding StatefulSets containing 'server' in their name..."
# Use a more reliable jsonpath query to get the names directly.
# The '|| true' ensures the script doesn't fail if no StatefulSets are found.
STS_LIST=$(kubectl get sts -n "$TARGET_NAMESPACE" --no-headers -o custom-columns=NAME:.metadata.name | grep "server" || true)

if [ -z "$STS_LIST" ]; then
  echo "    No matching 'server' StatefulSets found. Nothing to patch."
  exit 0
fi

echo "--> Found the following StatefulSets to patch:"
echo "$STS_LIST"

PATCH_JSON='{"spec":{"template":{"spec":{"imagePullSecrets":[{"name":"'"$SECRET_NAME"'"}]}}}}'

for STS_NAME in $STS_LIST; do
  echo "    - Patching ${STS_NAME}..."
  # Patch the StatefulSet. Redirect successful output to /dev/null for cleaner logs.
  kubectl patch sts "$STS_NAME" -n "$TARGET_NAMESPACE" -p "$PATCH_JSON" >/dev/null
done

echo
echo "--> Patching process complete."
echo "--> IMPORTANT: Pods must be restarted for the new imagePullSecrets to take effect."
echo "    Example: kubectl delete pod <pod-name> -n ${TARGET_NAMESPACE}"
```
 
##### 6. Connect to Clickhouse
Once the pods are up and healthy, you can validate connectivity to ClickHouse via port forwarding.  In a production environment you should use a load-balancer.

```
kubectl port-forward svc/c-$CLUSTER_NAME-server-any 9440:9440 -n ns-$CLUSTER_NAME
```

You can configure CA certs or other TLS settings via the file `clickhouse-client.yml`

```
<config>
  <openSSL>
    <client>
      <verificationMode>none</verificationMode>
    </client>
  </openSSL>
</config>
```

Here's a sample command to connect and test:

```bash
clickhouse-client -h localhost  --password "$PASSWORD" --secure
```

and run a simple query:

```bash
clickhouse-cloud :) select 1;
```

You should see output like this:

```bash
SELECT 1
Query id: 825591bf-a8e5-4995-ac9f-afb864854ba2
   ┌─1─┐
1. │ 1  │
   └───┘
1 row in set. Elapsed: 0.001 sec. 
```

#### Appendix - Troubleshooting

##### Missing `all-icr-io` secret in `clickhouse-operator-system` namespace.

```bash
Type     Reason                           Age                     From               Message
----     ------                           ----                    ----               -------
Normal   Scheduled                        4m43s                   default-scheduler  Successfully assigned clickhouse-operator-system/clickhouse-operator-clickhouse-operator-helm-68f8b596f5-tlkbn to chb-rke2s202
Normal   Pulling                          4m42s                   kubelet            Pulling image "gcr.io/kubebuilder/kube-rbac-proxy:v0.13.0"
Normal   Pulled                           4m41s                   kubelet            Successfully pulled image "gcr.io/kubebuilder/kube-rbac-proxy:v0.13.0" in 1.921s (1.921s including waiting). Image size: 25405613 bytes.
Normal   Created                          4m40s                   kubelet            Created container: kube-rbac-proxy
Normal   Started                          4m40s                   kubelet            Started container kube-rbac-proxy
Warning  Failed                           3m26s (x6 over 4m40s)   kubelet            Error: ImagePullBackOff
Warning  Failed                           3m11s (x4 over 4m42s)   kubelet            Failed to pull image "359774249275.dkr.ecr.us-east-2.amazonaws.com/bearing/clickhouse-operator:bearing4": failed to pull and unpack image "359774249275.dkr.ecr.us-east-2.amazonaws.com/bearing/clickhouse-operator:bearing4": failed to resolve reference "359774249275.dkr.ecr.us-east-2.amazonaws.com/bearing/clickhouse-operator:bearing4": pull access denied, repository does not exist or may require authorization: authorization failed: no basic auth credentials
Warning  Failed                           3m11s (x4 over 4m42s)   kubelet            Error: ErrImagePull
Warning  FailedToRetrieveImagePullSecret  2m57s (x11 over 4m43s)  kubelet            Unable to retrieve some image pull secrets (all-icr-io); attempting to pull the image may not succeed.
Normal   Pulling                          100s (x5 over 4m42s)    kubelet            Pulling image "359774249275.dkr.ecr.us-east-2.amazonaws.com/bearing/clickhouse-operator:bearing4"
Normal   BackOff                          51s (x16 over 4m40s)    kubelet            Back-off pulling image "359774249275.dkr.ecr.us-east-2.amazonaws.com/bearing/clickhouse-operator:bearing4"
```

#####  Missing local path storage CRDs

If `Install local storage driver` is skipped, when provisioning the Keepers you'll get a message visible via describe like this:

```bash
  Type     Reason            Age   From               Message
----     ------            ----  ----               -------
Warning  FailedScheduling  6s    default-scheduler  0/6 nodes are available: 1 node(s) didn't match pod anti-affinity rules, 2 node(s) didn't find available persistent volumes to bind, 3 node(s) didn't match Pod's node affinity/selector. preemption: 0/6 nodes are available: 1 No preemption victims found for incoming pod, 5 Preemption is not helpful for scheduling.
```

Digging into the PVC you'll see this:

```bash
kubectl get pvc -n ns-$CLUSTER_NAME 
NAME                                           STATUS    VOLUME   CAPACITY   ACCESS MODES   STORAGECLASS    VOLUMEATTRIBUTESCLASS   AGE
ch-storage-volume-c-baremetal-ch-01-keeper-0   Pending                                      local-nvme-sc   <unset>                 17h
ch-storage-volume-c-baremetal-ch-01-keeper-1   Pending                                      local-nvme-sc   <unset>                 17h
ch-storage-volume-c-baremetal-ch-01-keeper-2   Pending                                      local-nvme-sc   <unset>                 17h
```

Describing a keeper shows this:

```bash
kubectl describe pvc ch-storage-volume-c-baremetal-ch-01-keeper-0  -n ns-$CLUSTER_NAME 
Type    Reason                Age                   From                         Message
----    ------                ----                  ----                         -------
Normal  ExternalProvisioning  78s (x3262 over 13h)  persistentvolume-controller  Waiting for a volume to be created either by the external provisioner 'rancher.io/local-path' or manually by the system administrator. If volume creation is delayed, please verify that the provisioner is running and correctly registered.
```

##### Keeper images won't install due to operator not populating needed STS configuration

If you see this:

```bash
kubectl get pods -n ns-baremetal-ch-01                                                                                      chb-bastion101.chb.internal: Wed Nov 19 15:06:57 2025

NAME                         READY   STATUS             RESTARTS   AGE
c-baremetal-ch-01-keeper-0   0/1     ImagePullBackOff   0          10m
c-baremetal-ch-01-keeper-1   0/1     ImagePullBackOff   0          10m
c-baremetal-ch-01-keeper-2   0/1     ImagePullBackOff   0          10m
```

Describing Keeper shows this:

```bash
kubectl describe pod   c-baremetal-ch-01-keeper-0 -n ns-$CLUSTER_NAME
Type     Reason            Age                  From               Message
----     ------            ----                 ----               -------
Normal   Pulling           8m41s (x5 over 11m)  kubelet            Pulling image "359774249275.dkr.ecr.us-east-2.amazonaws.com/bearing/clickhouse-keeper:25.2.1.30176"
Warning  Failed            8m41s (x5 over 11m)  kubelet            Failed to pull image "359774249275.dkr.ecr.us-east-2.amazonaws.com/bearing/clickhouse-keeper:25.2.1.30176": failed to pull and unpack image "359774249275.dkr.ecr.us-east-2.amazonaws.com/bearing/clickhouse-keeper:25.2.1.30176": failed to resolve reference "359774249275.dkr.ecr.us-east-2.amazonaws.com/bearing/clickhouse-keeper:25.2.1.30176": unexpected status from HEAD request to https://359774249275.dkr.ecr.us-east-2.amazonaws.com/v2/bearing/clickhouse-keeper/manifests/25.2.1.30176: 403 Forbidden
Warning  Failed            8m41s (x5 over 11m)  kubelet            Error: ErrImagePull
Normal   BackOff           87s (x43 over 11m)   kubelet            Back-off pulling image "359774249275.dkr.ecr.us-east-2.amazonaws.com/bearing/clickhouse-keeper:25.2.1.30176"
Warning  Failed            87s (x43 over 11m)   kubelet            Error: ImagePullBackOff
```

Patch STS with 4_fix_keeper_sts.sh.  The main thing is to populate the secret in the `clickhouse-operator-system` and `ns-$CLUSTER_NAME` namespaces.  

For example:
- kubectl create secret docker-registry all-icr-io --docker-server=359774249275.dkr.ecr.us-east-2.amazonaws.com --docker-username=AWS --docker-password=$(aws ecr get-login-password) -n clickhouse-operator-system
- kubectl create secret docker-registry all-icr-io --docker-server=359774249275.dkr.ecr.us-east-2.amazonaws.com --docker-username=AWS --docker-password=$(aws ecr get-login-password) -n ns-$CLUSTER_NAME
*Note: If you have previously run this and time has passed then your token may have expired, so this needs to be re-run after deleting the secrets since they can't be updated in place.*

##### Keeper pods CrashLoopBackOffing

```bash
kubectl get pods -n ns-$CLUSTER_NAME  
NAME                         READY   STATUS             RESTARTS      AGE
c-baremetal-ch-01-keeper-0   0/1     CrashLoopBackOff   4 (78s ago)   2m51s
c-baremetal-ch-01-keeper-1   0/1     CrashLoopBackOff   4 (80s ago)   2m51s
c-baremetal-ch-01-keeper-2   0/1     CrashLoopBackOff   4 (76s ago)   2m51s
```

Check pod logs.  Probably MinIO bucket and key wasn't configured.

```bash
kubectl logs   c-baremetal-ch-01-keeper-0  -n ns-$CLUSTER_NAME|grep Error
2025.11.20 20:29:04.222931 [ 36 ] {} <Information> AWSClient: AWSErrorMarshaller: Encountered AWSError 'InvalidAccessKeyId': The Access Key Id you provided does not exist in our records.
Error message: The Access Key Id you provided does not exist in our records.
2025.11.20 20:29:04.223154 [ 36 ] {} <Error> WriteBufferFromS3: S3Exception name InvalidAccessKeyId, Message: The Access Key Id you provided does not exist in our records., bucket clickhouse-test-bucket, key ch-s3-00000000-0000-0000-0000-000000000001/keepers/0/log/clickhouse_access_check_ae5f1f43-c9cc-4b7e-95e2-bc52e234e610, object size 4
2025.11.20 20:29:04.223908 [ 1 ] {} <Error> virtual void DB::IDisk::checkAccessImpl(const String &): Code: 499. DB::Exception: Message: The Access Key Id you provided does not exist in our records., bucket clickhouse-test-bucket, key ch-s3-00000000-0000-0000-0000-000000000001/keepers/0/log/clickhouse_access_check_ae5f1f43-c9cc-4b7e-95e2-bc52e234e610, object size 4. (S3_ERROR), Stack trace (when copying this message, always include the lines below):
```

##### Keeper pods launch and are running/healthy but server pods haven't spawned

```bash
kubectl get pods -n ns-baremetal-ch-01                                                                                     chb-bastion101.chb.internal: Thu Nov 20 15:25:59 2025

NAME                         READY   STATUS    RESTARTS   AGE
c-baremetal-ch-01-keeper-0   1/1     Running   0          4m25s
c-baremetal-ch-01-keeper-1   1/1     Running   0          4m36s
c-baremetal-ch-01-keeper-2   1/1     Running   0          4m36s
```

Possibly the operator is not healthy:

```bash
NAME                                                            READY   STATUS             RESTARTS        AGE
clickhouse-operator-clickhouse-operator-helm-578f958c8d-25trn   1/2     CrashLoopBackOff   49 (3m4s ago)   5h42m
```

Describing the pod shows this:

```bash
Events:
  Type     Reason     Age                     From     Message
  ----     ------     ----                    ----     -------
  Normal   Pulled     7m34s (x50 over 5h44m)  kubelet  Container image "359774249275.dkr.ecr.us-east-2.amazonaws.com/bearing/clickhouse-operator:bearing5" already present on machine
  Normal   Created    7m34s (x50 over 5h44m)  kubelet  Created container: manager
  Warning  Unhealthy  5m10s (x2 over 4h31m)   kubelet  Liveness probe failed: Get "http://10.42.2.227:8081/healthz": dial tcp 10.42.2.227:8081: connect: connection refused
  Warning  BackOff    10s (x1130 over 5h40m)  kubelet  Back-off restarting failed container manager in pod clickhouse-operator-clickhouse-operator-helm-578f958c8d-25trn_clickhouse-operator-system(1d5142bd-13dc-4f08-b94f-19847b9470f8)
```
  
Attempt to delete operator pod to have it respawn:

```bash
kubectl delete pod clickhouse-operator-clickhouse-operator-helm-578f958c8d-25trn -n clickhouse-operator-system
```
  
##### Issue - Using operator 1.13538.1 causes this error.  Rolling back to 1.13500.1 works fine.

```json
  {
    "level": "error",
    "ts": "2025-11-20T15:41:00.538529446Z",
    "logger": "clickhouse.controller-runtime.source.EventHandler",
    "msg": "if kind is a CRD, it should be installed before calling Start",
    "kind": "DistributedCacheConfiguration.clickhouse.com",
    "error": "no matches for kind \"DistributedCacheConfiguration\" in version \"clickhouse.com/v1\"",
    "stacktrace": "sigs.k8s.io/controller-runtime/pkg/internal/source.(*Kind[...]).Start.func1.1\n\t/go/pkg/mod/sigs.k8s.io/controller-runtime@v0.20.4/pkg/internal/source/kind.go:71\nk8s.io/apimachinery/pkg/util/wait.loopConditionUntilContext.func2\n\t/go/pkg/mod/k8s.io/apimachinery@v0.32.3/pkg/util/wait/loop.go:87\nk8s.io/apimachinery/pkg/util/wait.loopConditionUntilContext\n\t/go/pkg/mod/k8s.io/apimachinery@v0.32.3/pkg/util/wait/loop.go:88\nk8s.io/apimachinery/pkg/util/wait.PollUntilContextCancel\n\t/go/pkg/mod/k8s.io/apimachinery@v0.32.3/pkg/util/wait/poll.go:33\nsigs.k8s.io/controller-runtime/pkg/internal/source.(*Kind[...]).Start.func1\n\t/go/pkg/mod/sigs.k8s.io/controller-runtime@v0.20.4/pkg/internal/source/kind.go:64"
  }  
```

##### If server pods are pending for a few minutes then check the operator logs, it may be a problem with your `sc local-nvme-sc` configuration.

```bash
NAME                                 READY   STATUS    RESTARTS   AGE
c-baremetal-ch-01-keeper-0           1/1     Running   0          2m27s
c-baremetal-ch-01-keeper-1           1/1     Running   0          2m26s
c-baremetal-ch-01-keeper-2           1/1     Running   0          2m27s
c-baremetal-ch-01-server-j06wboj-0   0/1     Pending   0          2m17s
c-baremetal-ch-01-server-mnmkyko-0   0/1     Pending   0          2m17s
c-baremetal-ch-01-server-rvg1nlv-0   0/1     Pending   0          2m17s
```
    
kubectl logs -l app=clickhouse-operator    -n clickhouse-operator-system |jq .

```json
{
  "level": "error",
  "ts": "2025-11-20T15:48:32Z",
  "logger": "clickhouse",
  "msg": "Reconciler error",
  "controller": "clickhousecluster",
  "controllerGroup": "clickhouse.com",
  "controllerKind": "ClickHouseCluster",
  "ClickHouseCluster": {
    "name": "c-baremetal-ch-01",
    "namespace": "ns-baremetal-ch-01"
  },
  "namespace": "ns-baremetal-ch-01",
  "name": "c-baremetal-ch-01",
  "reconcileID": "cf0fb078-93c6-4fb9-aa34-6a9557624c40",
  "error": "zone details couldn't be found for any PV rev2",
  "stacktrace": "sigs.k8s.io/controller-runtime/pkg/internal/controller.(*Controller).reconcileHandler\n\t/go/pkg/mod/sigs.k8s.io/controller-runtime@v0.18.4/pkg/internal/controller/controller.go:324\nsigs.k8s.io/controller-runtime/pkg/internal/controller.(*Controller).processNextWorkItem\n\t/go/pkg/mod/sigs.k8s.io/controller-runtime@v0.18.4/pkg/internal/controller/controller.go:261\nsigs.k8s.io/controller-runtime/pkg/internal/controller.(*Controller).Start.func2.2\n\t/go/pkg/mod/sigs.k8s.io/controller-runtime@v0.18.4/pkg/internal/controller/controller.go:222"
}
```

More evidence:

```bash
kubectl get pvc -n ns-$CLUSTER_NAME 
NAME                                                   STATUS    VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS    VOLUMEATTRIBUTESCLASS   AGE
ch-storage-volume-c-baremetal-ch-01-keeper-0           Bound     pvc-ab2d03b9-c81a-46b7-8729-109910d018b7   30Gi       RWO            local-nvme-sc   <unset>                 42h
ch-storage-volume-c-baremetal-ch-01-keeper-1           Bound     pvc-5dc4bd62-a03d-46ba-b5da-2769b28802b7   30Gi       RWO            local-nvme-sc   <unset>                 42h
ch-storage-volume-c-baremetal-ch-01-keeper-2           Bound     pvc-9298dd1b-9de2-4fc3-8441-d2eea0449823   30Gi       RWO            local-nvme-sc   <unset>                 42h
ch-storage-volume-c-baremetal-ch-01-server-j06wboj-0   Pending                                                                        local-nvme-sc   <unset>                 4m28s
ch-storage-volume-c-baremetal-ch-01-server-mnmkyko-0   Pending                                                                        local-nvme-sc   <unset>                 4m28s
ch-storage-volume-c-baremetal-ch-01-server-rvg1nlv-0   Pending                                                                        local-nvme-sc   <unset>                 4m28s
```

```bash
kubectl describe pvc ch-storage-volume-c-baremetal-ch-01-server-j06wboj-0 -n ns-$CLUSTER_NAME 

Type    Reason                Age                   From                         Message
----    ------                ----                  ----                         -------
Normal  WaitForFirstConsumer  5m24s                 persistentvolume-controller  waiting for first consumer to be created before binding
Normal  WaitForPodScheduled   13s (x21 over 5m13s)  persistentvolume-controller  waiting for pod c-baremetal-ch-01-server-j06wboj-0 to be scheduled
```
    
##### Debugging CrashLoopBackOff Errors 

If a pod is in CrashLoopBackOff state, describe the pod to get error messages and events: 

```bash
kubectl describe pod c-default-xx-01-keeper-0 -n ns-default-xx-01 
``` 

Example describe output indicating issues: 
```bash
 Type     Reason     Age                    From               Message 
  ----     ------     ----                   ----               ------- 
  Normal   Scheduled  2m57s                  default-scheduler  Successfully assigned ns-default-xx-01/c-default-xx-01-keeper-0 to 10.240.0.29 
  Warning  Unhealthy  2m35s (x2 over 2m50s)  kubelet            Readiness probe failed: 
  Warning  Unhealthy  84s (x3 over 2m49s)    kubelet            Readiness probe errored: rpc error: code = Unknown desc = failed to exec in container: container is in CONTAINER_EXITED state 
  Warning  Unhealthy  84s                    kubelet            Readiness probe errored: rpc error: code = NotFound desc = failed to exec in container: failed to load task: no running task found: task cd8c01c797712679b99eb9edb1004a451534b0b4d8f31ea0089a744b28a468ee not found: not found 
  Normal   Pulled     1s (x6 over 2m50s)     kubelet            Container image "<your_repo>/clickhouse-keeper:25.2.1.30176" already present on machine 
  Normal   Created    1s (x6 over 2m50s)     kubelet            Created container: c-default-xx-01-keeper 
  Normal   Started    1s (x6 over 2m50s)     kubelet            Started container c-default-xx-01-keeper 
  Warning  BackOff    0s (x18 over 2m48s)    kubelet            Back-off restarting failed container c-default-xx-01-keeper in pod c-default-xx-01-keeper-0_ns-default-xx-01(d099fad3-b9b2-48b9-a776-fabd8f3aa2a5) 
 ```
 
If you see errors, check the logs of the problematic pod: 

```bash
kubectl logs c-default-xx-01-keeper-0 -n ns-default-xx-01 
```

##### S3 Access Denied Errors 

If you encounter Access Denied errors related to S3 in the container logs (e.g., for keepers), you might need to shim the S3 credentials into the pod's environment variables. Instead of kubectl edit, you can use kubectl patch with a YAML file. 

Sample error: 

```bash
2025.07.10 20:12:36.893641 [ 1 ] {} <Error> Application: Code: 499. DB::Exception: Message: Access Denied, bucket ch-s3-bb1bf91e-0eae-4d02-a842-e75d660d62bc, key ch-s3-00000000-0000-0000-0000-000000000000/keepers/0/log/clickhouse_access_check_eacdcaed-ef86-488c-ae77-22a7ec0db795, object size 4: While checking access for disk s3_keeper_log_disk. (S3_ERROR), Stack trace (when copying this message, always include the lines below): 
 ```
 
Create a file named sts_keeper_patch.yaml with the following content, replacing YOUR_KEY and YOUR_SECRET with your actual AWS credentials: 

```yaml
apiVersion: apps/v1 
kind: StatefulSet 
metadata: 
  name: c-default-xx-01-keeper 
  namespace: ns-default-xx-01 
spec: 
  template: 
    spec: 
      containers: 
        - name: c-default-xx-01-keeper 
          env: 
          - name: AWS_ACCESS_KEY_ID 
            value: YOUR_KEY # Replace with your AWS Access Key ID 
          - name: AWS_SECRET_ACCESS_KEY 
            value: YOUR_SECRET # Replace with your AWS Secret Access Key 
 ```

Then apply the patch: 

```bash
kubectl patch sts c-default-xx-01-keeper -n ns-default-xx-01 --patch-file sts_keeper_patch.yaml 
```

After patching, watch the pods. You might need to delete the problematic pod to force it to respawn with the new configuration: 

```bash
kubectl delete pod c-default-xx-01-keeper-0 -n ns-default-xx-01 
```
 

Copy kubectl Secret to Another Namespace (if needed) 

If your kubectl secret needs to be copied to another namespace (e.g., from default to clickhouse-operator-system), use the following command. This should be handled already be the scripts. 
```bash
kubectl get secret all-icr-io -n default -o yaml | \ 
  sed 's/namespace: default/namespace: clickhouse-operator-system/g' | \ 
  sed 's/ creationTimestamp: .*//g' | \ 
  sed 's/  resourceVersion: .*//g' | \ 
  sed 's/  uid: .*//g' | \ 
  kubectl apply -f - 
```

Remove cached container images on nodes to validate the imagePullSecrets are working, otherwise it only matters the first time it is run on a node. 

##### Run script remove_cached_images.sh 

```bash
#!/bin/bash 
set -e 
 
echo "Starting cleanup process on all nodes..." 
echo "-----------------------------------" 
 
kubectl get nodes -o name | while read -r node_ref; do 
  node_name="${node_ref}" 
 
  echo "--> Processing $node_name" 
 
  # Step 1: Execute the debug command and capture ALL output into a variable. 
  # The '2>&1' ensures both standard output and errors are captured. 
  CMD_OUTPUT=$(kubectl debug $node_ref  \ 
    -n default -it --image=busybox --profile=general \ 
    -- sh -c 'chroot /host crictl rmi --all' 2>&1) 
 
  # Step 2: Print only the lines that begin with "Creating" or "Deleted". 
  # The '-E' flag enables extended regular expressions for the '|' (OR) operator. 
  # The '^' anchors the match to the beginning of the line. 
  echo "$CMD_OUTPUT" | grep -E '^Creating|^Deleted' 
 
  # Step 3: Parse the full output to find the pod name for deletion. 
  captured_pod_name=$(echo "$CMD_OUTPUT" | grep "Creating debugging pod" | awk '{print $4}') 
   
  if [ -n "$captured_pod_name" ]; then 
    echo "Cleaning up pod: $captured_pod_name" 
    kubectl delete pod "$captured_pod_name" -n default --wait=false 
  else 
    echo "    Warning: Could not determine pod name for node $node_name." 
  fi 
 
  echo "-----------------------------------" 
done 
 
echo "All nodes have been processed." 
```
