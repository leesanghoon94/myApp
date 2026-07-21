hpa 구현
hpa 사용할때 메트릭서버 필요

매니페스트로 배포

kubectl apply -f https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml

helm install myapp myChart

---

(⎈|arn:aws:eks:ap-northeast-2:650251731474:cluster/tftest:N/A)➜ manifest git:(main) ✗ helm install myapp myChart
W0708 19:21:26.067848 66116 warnings.go:70] unknown field "spec.template.limits"
W0708 19:21:26.067899 66116 warnings.go:70] unknown field "spec.template.requests"
W0708 19:21:26.067866 66116 warnings.go:70] unknown field "spec.template.limits"
W0708 19:21:26.067971 66116 warnings.go:70] unknown field "spec.template.requests"
NAME: myapp
LAST DEPLOYED: Wed Jul 8 19:21:24 2026
NAMESPACE: default
STATUS: deployed
REVISION: 1
TEST SUITE: None
apiVersion: v1
kind: Service
metadata:
name: frontend
spec:
selector:
app: frontend
ports: - port: 80
targetPort: 80

---

apiVersion: apps/v1
kind: Deployment
metadata:
name: frontend
spec:
replicas: 1
selector:
matchLabels:
app: frontend
template:
metadata:
labels:
app: frontend
spec:
containers: - name: frontend
image: leesanghoon94/front-local:v0.0.5
imagePullPolicy: Always
ports: - containerPort: 80
resources:
{{- toYaml .Values.apps.frontend.resources | nindent 4}}

---

apiVersion: v1
kind: Service
metadata:
name: server
spec:
ports: - port: 3333
targetPort: 3333
selector:
app: server

---

apiVersion: apps/v1
kind: Deployment
metadata:
name: server
spec:
replicas: 1
selector:
matchLabels:
app: server
template:
metadata:
labels:
app: server
spec:
containers: - name: server
image: leesanghoon94/server-local:v0.0.5
imagePullPolicy: Always
ports: - containerPort: 3333
resources:
{{- toYaml .Values.apps.server.resources | nindent 4}}

---

apiVersion: v1
kind: Secret
metadata:
name: mysql-password
data:
MYSQL_PASSWORD: MTIzNDU2Nzg=
MYSQL_ROOT_PASSWORD: MTIzNDU2Nzg=

---

apiVersion: v1
kind: ConfigMap
metadata:
name: db-env
data:
mysql_host: "mysql"
mysql_database: "article1"
mysql_user: "admin"

---

i-0686b6942a114a7bb pri a
i-0aea25c954eb9a9cd subnet-0ce91c9f4b12f9ead pri c

수정이안되는데 api 실패

게시판
취소
글 수정
...
본문
...

...

...

글 수정

---

helm repo add metrics-server https://kubernetes-sigs.github.io/metrics-server/

helm upgrade --install metrics-server metrics-server/metrics-server

https://github.com/kubernetes-sigs/metrics-server/tree/master/charts/metrics-server

kubectl get deployment metrics-server -n kube-system

https://docs.aws.amazon.com/ko_kr/eks/latest/userguide/metrics-server.html
