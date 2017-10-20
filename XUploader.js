/**
 * @author ����Ң ������version 1.0�汾
 */
function XUploader() {

	/**
	 * ��Ӧinput����
	 */
	var fileInput;

	/**
	 * ȫ�ֻص�����,�ⲿ����
	 */
	var onUploading, onSuccess, onFailed, onCanceled;

	/**
	 * FormData����,�洢���ϴ����ļ���������Ϣ��������Ϣ�Լ�ֵ����ʽ���
	 */
	var formData = new FormData();
	
	/**
	 * �����ϴ���
	 */
	var xhr = new XMLHttpRequest();

	/**
	 * ��ʼ���ļ��ϴ����� emIdΪinput [type = file]��Id
	 */
	this.bindFiles = function(emId) {
		fileInput = document.getElementById(emId);
		fileInput.onchange = function() {
			var files = fileInput.files;
			var fileInfo = {};
			if (files) {
				var fileSize = 0;
				for ( var i in files) {
					fileSize += files[i].size;
				}
				if (fileSize > 1024 * 1024 * 1024) {
					fileSize = (Math.round(fileSize * 100 / (1024 * 1024 * 1024)) / 100)
					.toString()
					+ 'G';
				} else if (fileSize > 1024 * 1024 && fileSize < 1024 * 1024 * 1024) {
					fileSize = (Math.round(fileSize * 100 / (1024 * 1024)) / 100)
							.toString()
							+ 'M';
				} else if (fileSize > 1024 && fileSize < 1024 * 1024){
					fileSize = (Math.round(fileSize * 100 / 1024) / 100)
							.toString()
							+ 'K';
				} else {
					fileSize = (Math.round(fileSize))
					.toString()
					+ 'B';
				}
			} else {

			}
		};
	}

	/**
	 * �ϴ��ļ�
	 */
	this.upload = function(url) {
		var name = fileInput.getAttribute("name");
		var fileLists = fileInput.files;
		if (fileLists) {
			for ( var i in fileLists) {
				formData.append(name, fileLists[i]);
			}
		}
		xhr.upload.addEventListener("progress", this.onProgress, false);
		xhr.addEventListener("load", this.onComplete, false);
		xhr.addEventListener("error", this.onFailed, false);
		xhr.addEventListener("abort", this.onCanceled, false);
		xhr.open("POST", url);// �޸ĳ��Լ��Ľӿ�
		xhr.send(formData);
	}
	
	/**
	 * ȡ���ϴ�
	 */
	this.cancel = function() {
		xhr.abort();
	}
	/**
	 * �ļ��ϴ���
	 */
	this.onProgress = function(evt) {
		if (evt.lengthComputable) {
			var percentComplete = Math.ceil(evt.loaded * 100 / evt.total)
					+ '%';
			var resp = {
				loader : evt.loaded,
				total : evt.total,
				percent : percentComplete
			};
			if (onUploading) {
				onUploading(resp);
			}
		} else {
			if (onUploading) {
				onUploading('unable to compute');
			}
		}
	}
	/**
	 * �ļ��ϴ����
	 */
	this.onComplete = function(evt) {
		if (onSuccess) {
			onSuccess(evt.target.responseText);
		}
		console.log("onSuccess");
	}
	/**
	 * �ļ��ϴ�ʧ��
	 */
	this.onFailed = function(evt) {
		if (onFailed) {
			onFailed("failed");
		}
		console.log("onFailed");
	}
	/**
	 * �ļ�ȡ���ϴ�
	 */
	this.onCanceled = function(evt) {
		if (onCanceled) {
			onCanceled("canceled");
		}
		console.log("onCanceled");
	}
	
	/**
	 * �����ϴ�ʱ�����ļ�ֵ����Ϣ
	 */
	this.setParams = function(mapData){
		if (mapData && mapData instanceof  HashMap) {
			var keyArray = mapData.keySet();
			for(var i = 0; i < mapData.size(); i++) {
				var k = keyArray[i];
				formData.append(k,mapData.get(k));
			}
		} else {
			alert("�����������ʹ��󣬱���ΪHashMap����");
		}
	}
	
	/**
	 * �����ϴ����̻ص�����
	 */
	this.setOnUploadingListener = function(callback) {
		onUploading = callback;
	}
	/**
	 * �����ϴ��ɹ��ص�����
	 */
	this.setOnSuccessListener = function(callback) {
		onSuccess = callback;
	}
	/**
	 * �����ϴ�ʧ�ܻص�����
	 */
	this.setOnFailedListener = function(callback) {
		onFailed = callback;
	}
	/**
	 * ����ȡ���ϴ��ص�����
	 */
	this.setOnCanceledListener = function(callback) {
		onCanceled = callback;
	}

}

/**
 * �����ֵ��
 */
function HashMap() {
	// ���峤��
	var length = 0;
	// ����һ������
	var obj = new Object();

	/**
	 * �ж�Map�Ƿ�Ϊ��
	 */
	this.isEmpty = function() {
		return length == 0;
	};

	/**
	 * �ж϶������Ƿ��������Key
	 */
	this.containsKey = function(key) {
		return(key in obj);
	};

	/**
	 * �ж϶������Ƿ����������Value
	 */
	this.containsValue = function(value) {
		for(var key in obj) {
			if(obj[key] == value) {
				return true;
			}
		}
		return false;
	};

	/**
	 * ��map���������
	 */
	this.put = function(key, value) {
		if(!this.containsKey(key)) {
			length++;
		}
		obj[key] = value;
	};

	/**
	 * ���ݸ�����Key���Value
	 */
	this.get = function(key) {
		return this.containsKey(key) ? obj[key] : null;
	};

	/**
	 * ���ݸ�����Keyɾ��һ��ֵ
	 */
	this.remove = function(key) {
		if(this.containsKey(key) && (delete obj[key])) {
			length--;
		}
	};

	/**
	 * ���Map�е�����Value
	 */
	this.values = function() {
		var _values = new Array();
		for(var key in obj) {
			_values.push(obj[key]);
		}
		return _values;
	};

	/**
	 * ���Map�е�����Key
	 */
	this.keySet = function() {
		var _keys = new Array();
		for(var key in obj) {
			_keys.push(key);
		}
		return _keys;
	};

	/**
	 * ���Map�ĳ���
	 */
	this.size = function() {
		return length;
	};

	/**
	 * ���Map
	 */
	this.clear = function() {
		length = 0;
		obj = new Object();
	};

	/**
	 * ��hashMapת����json
	 */
	this.toString = function() {
		var s = "[";
		var keyArray = this.keySet();
		for(var i = 0; i < length; i++, s += ',') {
			var k = keyArray[i];
			s += "{'" + k + "':" + obj[k] + "}";
		}
		s = s.substring(0, s.length - 1);
		if(s != "") {
			s += "]";
		}
		return s;
	}
}